import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const UserAvatar = () => {

    const {user} = useAuth(); 

  return (
    <Link to="/profile?tab=profile">
      <Avatar>
        <AvatarImage
          src={user?.profile_picture || "https://leapchanvuthy.vercel.app/images/Leapchanvuthy.png"}
          alt="User avatar"
        />
        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;