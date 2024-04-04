import { Button, Input, Textarea } from '@nextui-org/react'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useLoaderData, useNavigate } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { getContact, updateContact } from '~/lib/data'

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.contactId, 'Missing contactId param')
  const formData = await request.formData()
  await updateContact(params.contactId, Object.fromEntries(formData))
  return redirect(`/contacts/${params.contactId}`)
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.contactId, 'Missing contactId param')
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ contact })
}

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <Form method="post" className="flex max-w-xl flex-col gap-5">
      <div className="flex gap-5">
        <Input variant="bordered" label="First Name" defaultValue={contact.first} name="first" />
        <Input variant="bordered" label="Last Name" defaultValue={contact.last} name="last" />
      </div>
      <Input variant="bordered" label="Twitter" placeholder="@jack" defaultValue={contact.twitter} name="twitter" />
      <Input
        variant="bordered"
        label="Avatar URL"
        placeholder="https://example.com/avatar.jpg"
        defaultValue={contact.avatar}
        name="avatar"
      />
      <Textarea
        variant="bordered"
        label="Notes"
        placeholder="Here is a sample placeholder"
        defaultValue={contact.notes}
        name="notes"
      />
      <div className="flex gap-3">
        <Button type="submit" variant="bordered">
          Save
        </Button>
        <Button variant="bordered" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </Form>
  )
}
