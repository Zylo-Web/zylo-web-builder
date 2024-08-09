import {getAuthUserDetails} from "@/lib/queries"
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { current } from 'tailwindcss/colors'

const Page = async () => {
  const authUser = await currentUser()
  if(!authUser) return redirect('/sign-in')

  // const agencyId = await 

  const user = await getAuthUserDetails()



  return (

    <div>

      Agency
    </div>
  )
}

export default Page
