import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type UserAvatarProps = {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

export const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={user.image ?? ""} alt="user-avatar" />
      <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
