import { internalMutation } from "./_generated/server";
import { PROFILE_BACKGROUNDS, DEFAULT_BACKGROUND_ID } from "../lib/backgrounds";
import { PROFILE_TAGLINES, DEFAULT_TAGLINE_ID } from "../lib/taglines";

/**
 * One-time migration: converts users' profileTagline and profileBackground fields
 * from Convex document IDs (pointing to the now-deprecated profileTaglines /
 * profileBackgrounds tables) to plain string IDs defined in the library files.
 * Also backfills every starter tagline and background into existing users' inventories.
 *
 * Run once via the Convex dashboard or CLI:
 *   npx convex run migrations:migrateTaglinesAndBackgrounds
 *
 * After all users are migrated you can safely delete the profileTaglines and
 * profileBackgrounds table definitions from convex/schema.ts and clear their
 * data from the Convex dashboard.
 */
export const migrateTaglinesAndBackgrounds = internalMutation({
  args: {},
  async handler(ctx) {
    const bgByCss = Object.fromEntries(PROFILE_BACKGROUNDS.map((b) => [b.backgroundCSS, b.id]));
    const taglineByText = Object.fromEntries(PROFILE_TAGLINES.map((t) => [t.tagline, t.id]));
    const allLibraryTaglineIds = new Set(PROFILE_TAGLINES.map((t) => t.id));
    const allLibraryBgIds = new Set(PROFILE_BACKGROUNDS.map((b) => b.id));

    const starterTaglineIds = PROFILE_TAGLINES.filter((t) => t.tier === "starter").map((t) => t.id);
    const starterBgIds = PROFILE_BACKGROUNDS.filter((b) => b.tier === "starter").map((b) => b.id);

    function slugify(text: string): string {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 64);
    }

    const users = await ctx.db.query("users").collect();
    let migrated = 0;

    for (const user of users) {
      let newTagline: string | undefined;
      let newBackground: string | undefined;
      let newUnlockedTaglines: string[] | undefined;
      let newUnlockedBackgrounds: string[] | undefined;

      // --- profileTagline: convert old Convex ID → library string ID ---
      const rawTaglineId = user.profileTagline;
      if (!allLibraryTaglineIds.has(rawTaglineId)) {
        const taglineDoc = await (ctx.db as any).get(rawTaglineId).catch(() => null);
        if (taglineDoc && "tagline" in taglineDoc) {
          const text = (taglineDoc as { tagline: string }).tagline;
          newTagline = taglineByText[text] ?? slugify(text);
        }
      }

      // --- profileBackground: convert old Convex ID → library string ID ---
      const rawBgId = user.profileBackground;
      if (!allLibraryBgIds.has(rawBgId)) {
        const bgDoc = await (ctx.db as any).get(rawBgId).catch(() => null);
        if (bgDoc && "backgroundCSS" in bgDoc) {
          const css = (bgDoc as { backgroundCSS: string }).backgroundCSS;
          newBackground = bgByCss[css] ?? css;
        }
      }

      // --- unlockedProfileTaglines: convert IDs, then backfill all starter taglines ---
      const migratedTaglines: string[] = [];
      let anyTaglineChanged = false;
      for (const id of user.unlockedProfileTaglines) {
        if (allLibraryTaglineIds.has(id)) {
          migratedTaglines.push(id);
        } else {
          anyTaglineChanged = true;
          const doc = await (ctx.db as any).get(id).catch(() => null);
          if (doc && "tagline" in doc) {
            const text = (doc as { tagline: string }).tagline;
            migratedTaglines.push(taglineByText[text] ?? slugify(text));
          } else {
            migratedTaglines.push(id);
          }
        }
      }
      for (const starterId of starterTaglineIds) {
        if (!migratedTaglines.includes(starterId)) {
          migratedTaglines.push(starterId);
          anyTaglineChanged = true;
        }
      }
      if (anyTaglineChanged) newUnlockedTaglines = migratedTaglines;

      // --- unlockedProfileBackgrounds: convert IDs, then backfill all starter backgrounds ---
      const migratedBgs: string[] = [];
      let anyBgChanged = false;
      for (const id of user.unlockedProfileBackgrounds) {
        if (allLibraryBgIds.has(id)) {
          migratedBgs.push(id);
        } else {
          anyBgChanged = true;
          const doc = await (ctx.db as any).get(id).catch(() => null);
          if (doc && "backgroundCSS" in doc) {
            const css = (doc as { backgroundCSS: string }).backgroundCSS;
            migratedBgs.push(bgByCss[css] ?? css);
          } else {
            migratedBgs.push(id);
          }
        }
      }
      for (const starterId of starterBgIds) {
        if (!migratedBgs.includes(starterId)) {
          migratedBgs.push(starterId);
          anyBgChanged = true;
        }
      }
      if (anyBgChanged) newUnlockedBackgrounds = migratedBgs;

      // If the active tagline/background didn't survive conversion, reset to defaults
      const resolvedTagline = newTagline ?? user.profileTagline;
      if (!allLibraryTaglineIds.has(resolvedTagline)) {
        newTagline = DEFAULT_TAGLINE_ID;
      }
      const resolvedBg = newBackground ?? user.profileBackground;
      if (!allLibraryBgIds.has(resolvedBg)) {
        newBackground = DEFAULT_BACKGROUND_ID;
      }

      const hasChanges = newTagline || newBackground || newUnlockedTaglines || newUnlockedBackgrounds;
      if (hasChanges) {
        await ctx.db.patch(user._id, {
          ...(newTagline !== undefined && { profileTagline: newTagline }),
          ...(newBackground !== undefined && { profileBackground: newBackground }),
          ...(newUnlockedTaglines !== undefined && { unlockedProfileTaglines: newUnlockedTaglines }),
          ...(newUnlockedBackgrounds !== undefined && { unlockedProfileBackgrounds: newUnlockedBackgrounds }),
        });
        migrated++;
      }
    }

    return `Migrated ${migrated} of ${users.length} users.`;
  },
});
