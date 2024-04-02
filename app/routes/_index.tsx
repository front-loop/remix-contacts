import { Link } from '@nextui-org/react'

export default function Index() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-5xl font-bold">Remix</h1>
      <p>
        Check out remix{' '}
        <Link isExternal showAnchorIcon href="https://remix.run/docs">
          documentation
        </Link>
      </p>
    </div>
  )
}
