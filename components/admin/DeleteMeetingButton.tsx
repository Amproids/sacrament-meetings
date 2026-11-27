'use client';

import { useFormStatus } from 'react-dom';

interface DeleteMeetingButtonProps {
  /** Server Action already bound to the meeting's id. */
  action: () => Promise<void>;
  /** Shown in the confirmation, e.g. "Sunday, November 8, 2026". */
  meetingLabel: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-danger px-3 py-1 text-sm text-danger transition-colors hover:bg-danger hover:text-card disabled:opacity-60"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}

// Client Component because it asks for confirmation before submitting.
export default function DeleteMeetingButton({ action, meetingLabel }: DeleteMeetingButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the meeting on ${meetingLabel}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <SubmitButton />
    </form>
  );
}
