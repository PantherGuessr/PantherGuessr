import { useMutation } from "convex/react";
import { LoaderCircle, ShieldX } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";

interface BanAppealsProps {
  profileUsername: string;
  banReason: string | undefined;
  hasActiveAppeal: boolean;
}

const BanAppeal = ({ profileUsername, banReason, hasActiveAppeal }: BanAppealsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [banAppealDialogOpen, setBanAppealDialogOpen] = useState(false);
  const [appealMessage, setAppealMessage] = useState("");
  const [agreementCheck, setAgreementCheck] = useState(false);
  const submitAppeal = useMutation(api.users.appealBan);

  useEffect(() => {
    if (!appealMessage || !agreementCheck) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [agreementCheck, appealMessage]);

  async function handleSubmitAppeal() {
    setIsSubmitting(true);

    await submitAppeal({
      banReason,
      appealMessage,
    });

    setBanAppealDialogOpen(false);
    setIsSubmitting(false);
  }

  return (
    <Dialog open={banAppealDialogOpen} onOpenChange={setBanAppealDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={hasActiveAppeal}>
          <ShieldX className="h-4 w-4 mr-2" /> {hasActiveAppeal ? "Appeal Already Submitted" : "Submit Appeal"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suspension Appeal</DialogTitle>
          <DialogDescription>
            Submit a suspension appeal for PantherGuessr staff to read. The more seriously you take this appeal, the
            higher chance staff will take it seriously and issue a release of your suspension.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username" className="text-left">
              Username
            </Label>
            <Input id="username" disabled={true} defaultValue={`@${profileUsername}`} className="w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ban_reason" className="text-left">
              Suspension Reason
            </Label>
            <Input id="ban_reason" disabled={true} defaultValue={banReason ?? "None Provided"} className="w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user_message" className="text-left">
              Why should you be unsuspended?
            </Label>
            <Textarea
              id="user_message"
              disabled={isSubmitting}
              rows={5}
              resizeable={false}
              maxLength={1000}
              onChange={(event) => setAppealMessage(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreement"
                disabled={isSubmitting}
                onCheckedChange={(checked) => setAgreementCheck(!!checked)}
              />
              <Label htmlFor="agreement" className="text-left">
                I agree that if I am granted another chance, I will follow the{" "}
                <a href="/terms-and-conditions" className="underline">
                  terms and conditions
                </a>{" "}
                for play.
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          {isSubmitting ? (
            <Button variant="default" type="submit" disabled={true}>
              <LoaderCircle className="animate-spin mr-2" size={24} />
              Submitting Appeal
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setBanAppealDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" type="submit" disabled={canSubmit} onClick={handleSubmitAppeal}>
                Submit Appeal
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BanAppeal;
