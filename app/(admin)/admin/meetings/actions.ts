'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createMeeting as insertMeeting,
  deleteMeeting as removeMeeting,
  updateMeeting as saveMeeting,
  type MeetingInput,
} from '@/lib/meetings-db';
import {
  readMeetingForm,
  validateMeetingForm,
  type MeetingFormState,
} from '@/lib/meeting-form';

/*
  Server Actions for the admin meeting forms. They run on the server when a
  form is submitted.

  TODO: there is no sign-in yet, so anyone who can reach /admin (or POST to
  these actions directly) can change meetings. Check the user's role here
  once authentication is added.
*/

/** After any change, refresh every page that shows meetings. */
function refreshMeetingPages() {
  revalidatePath('/', 'layout');
}

async function save(
  prev: MeetingFormState,
  formData: FormData,
  write: (input: MeetingInput) => Promise<unknown>,
): Promise<MeetingFormState> {
  const values = readMeetingForm(formData);
  const { input, errors } = validateMeetingForm(values);
  if (errors) return { values, errors, attempt: prev.attempt + 1 };

  try {
    await write(input);
  } catch (error) {
    console.error('Saving meeting failed:', error);
    return {
      values,
      errors: { form: 'The meeting could not be saved. Please try again.' },
      attempt: prev.attempt + 1,
    };
  }

  // redirect() works by throwing, so it must stay outside the try/catch.
  refreshMeetingPages();
  redirect('/admin/meetings');
}

export async function createMeeting(
  prev: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  return save(prev, formData, insertMeeting);
}

/** Bound to a meeting id in the edit page: updateMeeting.bind(null, id). */
export async function updateMeeting(
  id: number,
  prev: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  return save(prev, formData, async (input) => {
    if (!(await saveMeeting(id, input))) {
      throw new Error(`No meeting with id ${id}`);
    }
  });
}

/** Bound to a meeting id in the list and edit pages. */
export async function deleteMeeting(id: number): Promise<void> {
  await removeMeeting(id);
  refreshMeetingPages();
  redirect('/admin/meetings');
}
