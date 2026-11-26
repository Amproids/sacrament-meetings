import { redirect } from 'next/navigation';

// /admin has no page of its own; meetings are the only thing to manage.
export default function AdminHome() {
  redirect('/admin/meetings');
}
