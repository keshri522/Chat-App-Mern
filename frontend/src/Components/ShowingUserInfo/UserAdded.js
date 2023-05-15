import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserAdded = ({ users, handleDelete, admin }) => {
  //sigle user design how to show all users
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="teal"
      cursor="pointer"
      onClick={() => handleDelete(users)}
    >
      {users.name}
      {/* here if last user._id ===admin means he is admin and we cannot deleted the admin logic of the code */}
      {admin === users._id && <span> (Admin)</span>}
      {/* this is button who is deleting the users */}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserAdded;
