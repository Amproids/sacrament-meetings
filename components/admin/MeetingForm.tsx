'use client';

import Link from 'next/link';
import { useActionState, useId, useState, type ReactNode } from 'react';
import type { MeetingFormState, MeetingFormValues } from '@/lib/meeting-form';
import { MEETING_TYPE_LABELS } from '@/lib/labels';
import type { MeetingType, SpeakerItem } from '@/lib/types';

type MeetingAction = (prev: MeetingFormState, formData: FormData) => Promise<MeetingFormState>;

interface MeetingFormProps {
  action: MeetingAction;
  initialValues: MeetingFormValues;
  submitLabel: string;
}

const inputClass =
  'mt-1 block w-full border border-rule bg-card px-3 py-2 text-ink aria-invalid:border-danger';

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-danger">
      {message}
    </p>
  );
}

interface FieldProps {
  label: string;
  name: keyof MeetingFormValues;
  state: MeetingFormState;
  hint?: string;
  className?: string;
  /** Renders the control, given the props that wire up its label and error. */
  children: (props: {
    id: string;
    name: string;
    'aria-invalid'?: true;
    'aria-describedby'?: string;
  }) => ReactNode;
}

/** A labelled form control with an optional hint and its error message. */
function Field({ label, name, state, hint, className, children }: FieldProps) {
  const id = useId();
  const error = state.errors[name];
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ');
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm text-muted">
        {label}
      </label>
      {children({
        id,
        name,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy || undefined,
      })}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted italic">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border border-rule bg-card p-5">
      <legend className="px-2 text-xs tracking-[0.2em] text-olive uppercase">{legend}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function HymnFields({
  label,
  prefix,
  state,
}: {
  label: string;
  prefix: 'opening' | 'sacrament' | 'closing';
  state: MeetingFormState;
}) {
  const number = `${prefix}HymnNumber` as const;
  const title = `${prefix}HymnTitle` as const;
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3 sm:col-span-2">
      <Field label={`${label} no.`} name={number} state={state}>
        {(props) => (
          <input
            {...props}
            type="number"
            min={1}
            max={9999}
            defaultValue={state.values[number]}
            className={inputClass}
          />
        )}
      </Field>
      <Field label={`${label} title`} name={title} state={state}>
        {(props) => (
          <input {...props} defaultValue={state.values[title]} className={inputClass} />
        )}
      </Field>
    </div>
  );
}

interface SpeakerRow extends SpeakerItem {
  key: number;
}

/**
 * Speakers and musical numbers, in program order. Each row submits
 * speakerName / speakerTopic / speakerType, which the server reads with
 * formData.getAll() in the same order.
 */
function SpeakersEditor({ state }: { state: MeetingFormState }) {
  const [nextKey, setNextKey] = useState(state.values.speakers.length);
  const [rows, setRows] = useState<SpeakerRow[]>(() =>
    state.values.speakers.map((s, key) => ({ ...s, key })),
  );
  const errorId = useId();

  function add(type: SpeakerItem['type']) {
    setRows([...rows, { key: nextKey, name: '', topic: '', type }]);
    setNextKey(nextKey + 1);
  }

  function update(key: number, changes: Partial<SpeakerItem>) {
    setRows(rows.map((row) => (row.key === key ? { ...row, ...changes } : row)));
  }

  function move(index: number, by: -1 | 1) {
    const next = [...rows];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    setRows(next);
  }

  const buttonClass =
    'border border-rule px-2 py-1 text-xs text-muted hover:border-brown hover:text-ink disabled:opacity-40';

  return (
    <fieldset
      className="border border-rule bg-card p-5"
      aria-describedby={state.errors.speakers ? errorId : undefined}
    >
      <legend className="px-2 text-xs tracking-[0.2em] text-olive uppercase">
        Speakers and musical numbers
      </legend>

      {rows.length === 0 && (
        <p className="text-sm text-muted italic">
          None yet. Fast and testimony meetings usually have no speakers.
        </p>
      )}

      <ol className="space-y-4">
        {rows.map((row, index) => (
          <li key={row.key} className="grid gap-3 border-b border-rule pb-4 sm:grid-cols-[10rem_1fr_1fr]">
            <label className="text-sm text-muted">
              Type
              <select
                name="speakerType"
                value={row.type}
                onChange={(e) => update(row.key, { type: e.target.value as SpeakerItem['type'] })}
                className={inputClass}
              >
                <option value="speaker">Speaker</option>
                <option value="musical-number">Musical number</option>
              </select>
            </label>
            <label className="text-sm text-muted">
              {row.type === 'speaker' ? 'Name' : 'Performer'}
              <input
                name="speakerName"
                value={row.name}
                onChange={(e) => update(row.key, { name: e.target.value })}
                aria-invalid={state.errors.speakers && !row.name ? true : undefined}
                className={inputClass}
              />
            </label>
            <label className="text-sm text-muted">
              {row.type === 'speaker' ? 'Topic' : 'Song'}
              <input
                name="speakerTopic"
                value={row.topic}
                onChange={(e) => update(row.key, { topic: e.target.value })}
                className={inputClass}
              />
            </label>
            <div className="flex gap-2 sm:col-span-3">
              <button type="button" className={buttonClass} disabled={index === 0} onClick={() => move(index, -1)}>
                Move up
              </button>
              <button
                type="button"
                className={buttonClass}
                disabled={index === rows.length - 1}
                onClick={() => move(index, 1)}
              >
                Move down
              </button>
              <button
                type="button"
                className={`${buttonClass} text-danger`}
                onClick={() => setRows(rows.filter((r) => r.key !== row.key))}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ol>

      <FieldError id={errorId} message={state.errors.speakers} />

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={buttonClass} onClick={() => add('speaker')}>
          + Add speaker
        </button>
        <button type="button" className={buttonClass} onClick={() => add('musical-number')}>
          + Add musical number
        </button>
      </div>
    </fieldset>
  );
}

export default function MeetingForm({ action, initialValues, submitLabel }: MeetingFormProps) {
  const [state, formAction, pending] = useActionState(action, {
    values: initialValues,
    errors: {},
    attempt: 0,
  });

  return (
    // React resets a form after its action runs. Re-mounting it (new key)
    // after each failed submit refills it from state.values instead, so the
    // user's input isn't lost.
    <form key={state.attempt} action={formAction} noValidate className="space-y-6">
      {state.errors.form && (
        <p role="alert" className="border-l-4 border-danger bg-card px-4 py-3 text-danger">
          {state.errors.form}
        </p>
      )}
      {state.attempt > 0 && !state.errors.form && (
        <p role="alert" className="border-l-4 border-danger bg-card px-4 py-3 text-danger">
          Please fix the highlighted fields.
        </p>
      )}

      <Fieldset legend="Meeting">
        <Field label="Date" name="date" state={state}>
          {(props) => (
            <input {...props} type="date" defaultValue={state.values.date} className={inputClass} />
          )}
        </Field>
        <Field label="Meeting type" name="meetingType" state={state}>
          {(props) => (
            <select {...props} defaultValue={state.values.meetingType} className={inputClass}>
              {(Object.keys(MEETING_TYPE_LABELS) as MeetingType[]).map((type) => (
                <option key={type} value={type}>
                  {MEETING_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Presiding" name="presiding" state={state}>
          {(props) => <input {...props} defaultValue={state.values.presiding} className={inputClass} />}
        </Field>
        <Field label="Conducting" name="conducting" state={state}>
          {(props) => <input {...props} defaultValue={state.values.conducting} className={inputClass} />}
        </Field>
        <Field label="Announcements" name="announcements" state={state} hint="One per line." className="sm:col-span-2">
          {(props) => (
            <textarea {...props} rows={3} defaultValue={state.values.announcements} className={inputClass} />
          )}
        </Field>
      </Fieldset>

      <Fieldset legend="Opening">
        <HymnFields label="Opening hymn" prefix="opening" state={state} />
        <Field label="Opening prayer" name="openingPrayer" state={state}>
          {(props) => <input {...props} defaultValue={state.values.openingPrayer} className={inputClass} />}
        </Field>
      </Fieldset>

      <Fieldset legend="Business and sacrament">
        <Field
          label="Ward business"
          name="wardBusiness"
          state={state}
          hint="One item per line (releases, sustainings, confirmations…)."
          className="sm:col-span-2"
        >
          {(props) => (
            <textarea {...props} rows={3} defaultValue={state.values.wardBusiness} className={inputClass} />
          )}
        </Field>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="stakeBusiness" defaultChecked={state.values.stakeBusiness} />
          Stake business this week
        </label>
        <HymnFields label="Sacrament hymn" prefix="sacrament" state={state} />
        <p className="-mt-2 text-xs text-muted italic sm:col-span-2">
          Leave the sacrament hymn blank for stake or general conference.
        </p>
      </Fieldset>

      <SpeakersEditor state={state} />

      <Fieldset legend="Closing">
        <HymnFields label="Closing hymn" prefix="closing" state={state} />
        <Field label="Closing prayer" name="closingPrayer" state={state}>
          {(props) => <input {...props} defaultValue={state.values.closingPrayer} className={inputClass} />}
        </Field>
      </Fieldset>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="border border-olive bg-olive px-6 py-3 text-sm tracking-[0.15em] text-card uppercase transition-colors hover:bg-olive-dark disabled:opacity-60"
        >
          {pending ? 'Saving…' : submitLabel}
        </button>
        <Link href="/admin/meetings" className="text-sm text-muted hover:text-ink hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
