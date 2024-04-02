import { Link } from '@nextui-org/react'
import { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-3 font-serif">
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
