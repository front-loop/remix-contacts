import { type ActionFunctionArgs, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { deleteContact } from '~/lib/data'

export async function action({ params }: ActionFunctionArgs) {
  invariant(params.contactId, 'Missing contactId param')
  await deleteContact(params.contactId)
  return redirect('/')
}
