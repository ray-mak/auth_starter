import { getCurrentUser } from "@/auth/nextjs/currentUser"
import LogOutButton from "@/components/LogOutButton"
import SendVerificationEmailBtn from "@/components/SendVerificationEmailBtn"
import UpdatePasswordForm from "@/components/UpdatePasswordForm"

export default async function Home() {
  const user = await getCurrentUser({ withFullUser: true })
  console.log(user)

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-3xl h-full">
        Real-world coding interviews for every hiring process
      </p>
      {user && (
        <div className="flex flex-col items-center justify-center mt-8 border w-1/2 gap-4">
          <p className="p-8 rounded border w-1/2 bg-white">
            User: {user?.username}
          </p>
          {user.email && (
            <div>
              Email: {user.email}
              {!user.isVerified && (
                <SendVerificationEmailBtn email={user.email} />
              )}
              <SendVerificationEmailBtn email={user.email} />
            </div>
          )}
          <LogOutButton />
        </div>
      )}
      {user && <UpdatePasswordForm userId={user?.id} />}
    </div>
  )
}
