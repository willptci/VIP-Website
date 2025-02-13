import { Link } from 'lucide-react'
import React from 'react'

const SignInPrompt = () => {
  return (
    <div>
        <Link href="/sign-in" className="text-custom-8 hover:underline">
            Please Sign In Here
        </Link>
    </div>
  )
}

export default SignInPrompt