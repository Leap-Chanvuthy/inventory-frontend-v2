import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const UserAvatar = () => {

    const {user} = useAuth(); 

  return (
    <Avatar>
      <AvatarImage
        src={user?.profile_picture || "https://leapchanvuthy.vercel.app/images/Leapchanvuthy.png"}
        alt="User avatar"
      />
      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;