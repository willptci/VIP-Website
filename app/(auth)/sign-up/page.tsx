import React from 'react'
import AuthForm from '@/components/ui/AuthForm'
import bg_image from '/public/tempBackgrounds/Andros-auth-bg.jpg';

const SignUp = () => {
  return (
    <main
      className="bg-cover bg-center"
      style={{ backgroundImage: `url(${bg_image.src})` }}
    >
      <section className="flex justify-center items-center h-screen w-full">
        <div className="bg-white border border-gray-300 rounded-3xl p-14 shadow-lg max-w-md w-full max-sm:px-6">
          <AuthForm type='sign-up' />
        </div>
      </section>
    </main>
  )
}

export default SignUp