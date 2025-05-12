import { useNavigate } from "react-router-dom";
import { Avatar } from "antd";
import("./index.scss");

const useDropDownListPeopleItem = () => {
  const navigate = useNavigate();

  const onClickAccount = (id) => {
    navigate(`/doctor/patient/${id}`);
  };

  const getItemDropDownSearchAccount = (accountList) => {
    console.log("accountList", accountList);

    return accountList.map((account) => ({
      key: account._id,
      label: (
        <div
          class="search-account-item-wrapper"
          onClick={() => onClickAccount(account._id)}
          key={account._id}
        >
          <Avatar src={account.avatar} size={50} shape="square" />
          <div class="search-account-item-content">
            <p class="search-account-item-name">{account?.name}</p>
            <p class="search-account-item-email">
              <strong>Email : </strong>
              {account?.email}
            </p>
          </div>
        </div>
      ),
    }));
  };

  return { getItemDropDownSearchAccount };
};

export default useDropDownListPeopleItem;
