"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteUserAccount } from "@/lib/actions/account-actions";
import { TransactionAccount } from "@/types";
import { Loader } from "lucide-react";
import { TransitionStartFunction, useState } from "react";
import { toast } from "sonner";

const AccountDeleteDialog = ({
  account,
  isEditPending,
  isDeletePending,
  refetchUserAccounts,
  startDeleteTransition,
}: {
  account: TransactionAccount;
  isEditPending: boolean;
  isDeletePending: boolean;
  refetchUserAccounts: () => void;
  startDeleteTransition: TransitionStartFunction;
}) => {
  const [openDialog, setDialog] = useState(false);

  const handleDeleteAccount = () => {
    startDeleteTransition(async () => {
      const response = await deleteUserAccount(account.id);

      if (response.success) {
        setDialog(false);
        toast(<p className="toast-text text-delete">{response.message}</p>);
        await refetchUserAccounts();
      }
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setDialog}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-red-700 hover:bg-red-600 cursor-pointer"
          disabled={isDeletePending || isEditPending}
        >
          {isDeletePending || isEditPending ? (
            <Loader className="animate-spin" />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-red-700">Delete Account</DialogTitle>
        <DialogDescription>
          <span className="font-bold">
            Are you sure you want to delete this account?{" "}
          </span>{" "}
          This will uncategorize your transactions related to this account and
          will not be included in the summary report.
        </DialogDescription>
        <div className="flex gap-1 text-sm md:text-base">
          <p className="font-bold">Account name:</p>
          <p>{account.name}</p>
        </div>
        <Button
          className="w-full bg-red-700 hover:bg-red-600 cursor-pointer"
          disabled={isDeletePending}
          onClick={handleDeleteAccount}
        >
          {isDeletePending ? <Loader className="animate-spin" /> : "Delete"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDeleteDialog;
