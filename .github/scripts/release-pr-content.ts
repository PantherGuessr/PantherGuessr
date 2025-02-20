import * as fs from "fs";
import * as path from "path";
import { Octokit } from "@octokit/rest";

export default async function releasePrContent(releaseVersion: string, baseBranch: string): Promise<void> {
  const githubToken = process.env.GITHUB_TOKEN;
  const repoOwner = process.env.GITHUB_REPOSITORY_OWNER;
  const repoName = process.env.GITHUB_REPOSITORY.split("/")[1]; // Split to get just the repo name

  if (!githubToken || !repoOwner || !repoName) {
    console.error(
      "Error: Missing required GitHub environment variables (GITHUB_TOKEN, GITHUB_REPOSITORY_OWNER, GITHUB_REPOSITORY)."
    );
    process.exit(1); // Exit with an error code
  }

  const octokit = new Octokit({ auth: githubToken });

  console.log(`Generating release PR content for version ${releaseVersion} to branch ${baseBranch}`);

  // --- Step 1: Update Version in package.json ---
  let versionUpdated = false;
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const oldVersion = packageJsonContent.version;
      packageJsonContent.version = releaseVersion;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2) + "\n");
      versionUpdated = true;
      console.log(`Updated version in package.json from ${oldVersion} to ${releaseVersion}`);
    } catch (error: any) {
      // Added type annotation for error
      console.error("Error updating package.json:", error.message);
    }
  } else {
    console.warn("package.json not found at root.");
  }

  // --- Step 2: Generate Patch Notes from PR Bodies ---
  let patchNotes = "";
  let patchNoteMessages: string[] = []; // To store just the messages for changelog.json
  try {
    const mergedPRs = await fetchMergedPullRequests(octokit, baseBranch);
    const patchNotesByCategory = extractPatchNotesFromPRs(mergedPRs); // Get categorized notes
    patchNotes = formatPatchNotes(patchNotesByCategory); // Format for PR body
    patchNoteMessages = extractMessagesForChangelog(patchNotesByCategory); // Extract messages for changelog.json
  } catch (error: any) {
    console.error("Error generating patch notes:", error.message);
    patchNotes = "Error generating patch notes. Please review commit history manually."; // Fallback message
    patchNoteMessages = ["Error generating changelog notes. Please review commit history manually."]; // Fallback for changelog
  }

  // --- Step 3: Update changelog.json ---
  const changelogJsonPath = path.join(process.cwd(), "changelog.json");
  let changelogUpdated = false;
  try {
    let changelogContent: any = { releases: {} }; // Default content if file doesn't exist
    if (fs.existsSync(changelogJsonPath)) {
      changelogContent = JSON.parse(fs.readFileSync(changelogJsonPath, "utf8"));
    }
    if (!changelogContent.releases) {
      // Ensure 'releases' object exists
      changelogContent.releases = {};
    }

    changelogContent.releases[releaseVersion] = patchNoteMessages; // Add release notes
    fs.writeFileSync(changelogJsonPath, JSON.stringify(changelogContent, null, 2) + "\n");
    changelogUpdated = true;
    console.log(`Updated changelog.json for version ${releaseVersion}`);
  } catch (error: any) {
    console.error("Error updating changelog.json:", error.message);
  }

  // --- Step 4: Construct PR Title and Body ---
  const prTitle = `Release v${releaseVersion}`;
  let prBody = `## Release v${releaseVersion}\n\n`;

  if (versionUpdated) {
    prBody += `This pull request updates the version to \`v${releaseVersion}\` in \`package.json\`.\n\n`;
  }
  if (changelogUpdated) {
    prBody += `This pull request updates \`changelog.json\` with release notes for \`v${releaseVersion}\`.\n\n`;
  }

  if (patchNotes) {
    prBody += `### Patch Notes\n\n${patchNotes}\n\n`;
  } else {
    prBody += "No significant changes detected since the last release (or no PRs with patch notes found).\n\n";
  }

  prBody += "Please review and edit these release notes and version changes before merging.";

  // --- Step 5: Set Workflow Outputs ---
  setOutput("pr_title", prTitle);
  setOutput("pr_body", prBody);
  setOutput("version_updated", versionUpdated.toString());
  setOutput("patch_notes_generated", patchNotes ? "true" : "false");

  console.log("Release PR content generation completed.");
}

// --- Helper Functions (outside releasePrContent function) ---

async function fetchMergedPullRequests(octokit: Octokit, baseBranch: string): Promise<any[]> {
  const repoOwner = process.env.GITHUB_REPOSITORY_OWNER!; // Non-null assertion, as checked in main function
  const repoName = process.env.GITHUB_REPOSITORY!.split("/")[1]; // Non-null assertion, as checked in main function

  let previousTag = "";
  try {
    const latestRelease = await octokit.rest.repos.getLatestRelease({
      owner: repoOwner,
      repo: repoName,
    });
    previousTag = latestRelease.data.tag_name;
  } catch (error: any) {
    console.log("No previous release tag found. Fetching all merged PRs.");
    previousTag = null; // No previous release
  }

  const mergedPRs: any[] = [];
  let page = 1;
  const perPage = 100; // Adjust as needed

  console.log(`Fetching merged PRs since tag: ${previousTag || "beginning"}`);

  while (true) {
    const prList = await octokit.rest.pulls.list({
      owner: repoOwner,
      repo: repoName,
      base: baseBranch,
      state: "closed",
      sort: "merged_at" as any,
      direction: "desc",
      per_page: perPage,
      page: page,
    });

    if (prList.data.length === 0) {
      break; // No more PRs on this page
    }

    for (const pr of prList.data) {
      if (pr.merged_at) {
        // Ensure it's merged
        if (previousTag) {
          // Compare merged_at date with the tag date (if tag exists)
          let tagDateTime: Date | null = null; // Initialize tagDateTime outside if block
          if (previousTag) {
            try {
              const tagRefResponse = await octokit.rest.git.getRef({
                owner: repoOwner,
                repo: repoName,
                ref: `tags/${previousTag}`,
              });
              const tagSha = tagRefResponse.data.object.sha; // Get SHA of the tag object
              const tagObjectResponse = await octokit.rest.git.getTag({
                owner: repoOwner,
                repo: repoName,
                tag_sha: tagSha,
              }); // Fetch Tag Object using SHA
              tagDateTime = tagObjectResponse.data.tagger?.date ? new Date(tagObjectResponse.data.tagger.date) : null; // Get date from tagger
            } catch (tagError: any) {
              console.warn(`Error fetching tag object for ${previousTag}: ${tagError.message}`);
              tagDateTime = null; // If error fetching tag object, treat tag date as unknown
            }
          }

          const mergedDate = new Date(pr.merged_at);
          const tagDateTimeAdjusted = tagDateTime ? tagDateTime : new Date(0); // If no tag date, consider tag time as epoch

          if (!previousTag || mergedDate > tagDateTimeAdjusted) {
            // Include if no tag or merged after tag
            mergedPRs.push(pr);
          } else if (previousTag && mergedDate <= tagDateTimeAdjusted) {
            console.log(`Stopping PR fetch as PR merged before tag: ${previousTag}`);
            return mergedPRs; // Stop fetching if PR is older than the tag
          }
        } else {
          mergedPRs.push(pr); // If no previous tag, include all merged PRs
        }
      }
    }
    page++;
  }

  return mergedPRs;
}

function extractPatchNotesFromPRs(mergedPRs: any[]): { [category: string]: string[] } {
  // Return type is now explicitly defined
  interface PatchNote {
    category: string;
    message: string;
  }
  const patchNotesByCategory: { [category: string]: string[] } = {};

  if (!mergedPRs || mergedPRs.length === 0) {
    console.log("No new merged pull requests found since last release (or beginning).");
    return patchNotesByCategory; // Return empty object if no PRs
  }

  mergedPRs.forEach((pr) => {
    const prBody = pr.body || ""; // Handle cases where PR body might be empty
    const lines = prBody.split("\n");
    const prPatchNotes: PatchNote[] = [];

    lines.forEach((line) => {
      const patchNotesPrefix = "Patch Notes:";
      if (line.startsWith(patchNotesPrefix)) {
        const noteContent = line.substring(patchNotesPrefix.length).trim();
        if (noteContent) {
          const parts = noteContent.match(/^\[(.*?)\]\s*(.*)$/); // Regex to capture [CATEGORY] MESSAGE
          if (parts && parts.length === 3) {
            const category = parts[1].trim();
            const message = parts[2].trim();
            if (category && message) {
              prPatchNotes.push({ category: category, message: message });
            }
          } else {
            console.log(
              `Warning: Invalid Patch Notes format in PR #${pr.number}: ${line}. Expected format: 'Patch Notes: [CATEGORY] MESSAGE'`
            );
          }
        }
      }
    });

    if (prPatchNotes.length > 0) {
      prPatchNotes.forEach((note) => {
        if (!patchNotesByCategory[note.category]) {
          patchNotesByCategory[note.category] = [];
        }
        patchNotesByCategory[note.category].push(note.message);
      });
    }
  });
  return patchNotesByCategory; // Return categorized patch notes
}

function formatPatchNotes(patchNotesByCategory: { [category: string]: string[] }): string {
  // Formats for PR body
  let formattedPatchNotes = "";
  for (const category in patchNotesByCategory) {
    formattedPatchNotes += `### ${category}\n`;
    patchNotesByCategory[category].forEach((message) => {
      formattedPatchNotes += `- ${message}\n`;
    });
    formattedPatchNotes += "\n"; // Add extra newline for spacing between categories
  }
  return formattedPatchNotes.trim();
}

function extractMessagesForChangelog(patchNotesByCategory: { [category: string]: string[] }): string[] {
  // Extracts messages for changelog.json
  let messages: string[] = [];
  for (const category in patchNotesByCategory) {
    messages = messages.concat(patchNotesByCategory[category]); // Concatenate all messages into a single array
  }
  return messages;
}

function setOutput(name: string, value: string): void {
  process.stdout.write(`::set-output name=${name}::${value}\n`);
}
