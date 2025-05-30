"use client";

import { useActionState, useEffect, useState } from "react";
import { format } from "date-fns";
import moment from "moment";
import { toast } from "sonner";
import { PenLine, CalendarIcon, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { cn, currencyFormatter } from "@/lib/utils";
import { editTransaction } from "@/lib/actions/transaction-actions";

import { Transactions, TransactionAccount } from "@/types";
import useAccounts from "@/lib/hooks/useAccounts";

type Props = {
  transaction: Transactions;
  refetchDailyTransactions: () => void;
};

const DailyTransactionEditItem = ({
  transaction,
  refetchDailyTransactions,
}: Props) => {
  const { userAccounts } = useAccounts();

  const [state, formAction, isPending] = useActionState(editTransaction, {
    success: false,
    message: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    new Date(transaction.date)
  );
  const [account, setAccount] = useState(transaction.transactionAccountId);
  const [transactionType, setTransactionType] = useState(transaction.type);

  // Close dialog and refetch on success
  useEffect(() => {
    if (state.success) {
      refetchDailyTransactions();
      setOpenDialog(false);
      toast(<p className="toast-text text-confirm">{state.message}</p>);
    }
  }, [state, refetchDailyTransactions]);

  const formattedDate = moment(date).format("MMM DD, YYYY");

  const handleDialogChange = (isOpen: boolean) => {
    setOpenDialog(isOpen);

    if (!isOpen) {
      setDate(transaction.date);
      setAccount(transaction.transactionAccountId);
      setTransactionType(transaction.type);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <PenLine className="cursor-pointer text-green-700" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle className="font-bold text-green-700">
            Edit Transaction
          </DialogTitle>
          <DialogDescription className="text-base">
            {moment(date).format("MMM D, YYYY")}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={transaction.id} />
          <input type="hidden" name="userId" value={transaction.userId} />
          <input type="hidden" name="date" value={formattedDate} />
          <input type="hidden" name="account" value={account} />
          <input type="hidden" name="type" value={transactionType} />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "daily-form-item justify-start text-left font-normal w-full",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
              />
            </PopoverContent>
          </Popover>

          <Input
            name="note"
            defaultValue={transaction.note}
            placeholder="Note"
            className="daily-form-item"
            required
            maxLength={30}
          />

          <Input
            id="details"
            defaultValue={transaction.details}
            name="details"
            className="daily-form-item"
            placeholder="Note details"
            maxLength={30}
          />

          <Input
            name="amount"
            type="number"
            step="0.01"
            defaultValue={transaction.amount}
            placeholder={currencyFormatter.format(0)}
            className="daily-form-item"
            required
          />

          <Select
            value={account}
            onValueChange={setAccount}
            defaultValue={transaction.transactionAccountId}
          >
            <SelectTrigger className="w-full daily-form-item">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {userAccounts?.accounts?.map((acct: TransactionAccount) => (
                <SelectItem key={acct.id} value={acct.id}>
                  {acct.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Select */}
          <Select
            value={transactionType}
            onValueChange={setTransactionType}
            defaultValue={transaction.type}
          >
            <SelectTrigger
              className={cn(
                "w-full daily-form-item",
                transactionType === "income"
                  ? "income-text border-green-700"
                  : "expense-text border-red-700"
              )}
            >
              <SelectValue placeholder="Income/Expense" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense" className="expense-text">
                Expense
              </SelectItem>
              <SelectItem value="income" className="income-text">
                Income
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Edit Transaction"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DailyTransactionEditItem;
