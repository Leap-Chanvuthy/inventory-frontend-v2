import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const UserAvatar = () => {

    const {user} = useAuth(); 

  return (
    <Link to="/profile?tab=profile">
      <Avatar>
        <AvatarImage
          src={user?.profile_picture || ""}
          alt="User avatar"
        />
        <AvatarFallback>
          {user?.name
            ? user.name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join("")
            : "U"}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;