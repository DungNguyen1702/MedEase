import TextArea from "antd/es/input/TextArea";
import "./index.scss";
import { useEffect, useRef, useState } from "react";
import { Anchor, Dropdown, Input } from "antd";
import useDropDownListPeopleItem from "./Components/Dropdown";
import { paginateData } from "../../../../utils/stringUtil";
import PatientCard from "./Components/PatientCard";
import PaginationComponent from "../../../../components/Pagination";
import { patientAPI } from "../../../../api/patientAPI";
import axiosClient from "../../../../utils/axiosCustomize";

function DoctorPatient() {
  const [search, setSearch] = useState("");

  // original data
  const [exminatedPatients, setListExaminatedPatients] = useState([]);
  const [patients, setPatients] = useState([]);

  // pagination
  const [total, setTotal] = useState({
    examinatedPatient: 0,
    allPatient: 0,
  });
  const [page, setPage] = useState({
    examinatedPatient: 1,
    allPatient: 1,
  });
  const [limit, setLimit] = useState(6);

  // pagination data
  const [paginatedExaminatedPatients, setPaginatedExaminatedPatients] =
    useState(paginateData(exminatedPatients, page.examinatedPatient, limit));
  const [paginatedPatients, setPaginatedPatients] = useState(
    paginateData(patients, page.allPatient, limit)
  );

  const [listPatientSearch, setListPatientSearch] = useState(patients);

  useEffect(() => {
    setPaginatedExaminatedPatients(
      paginateData(exminatedPatients, page.examinatedPatient, limit)
    );
    setPaginatedPatients(paginateData(patients, page.allPatient, limit));
  }, [page, total, limit, exminatedPatients, patients]);

  useEffect(() => {
    if (search.length !== 0)
      setListPatientSearch(
        patients.filter(
          (account) =>
            account.name.toLowerCase().includes(search.toLowerCase()) ||
            account.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    else setListPatientSearch(patients);
  }, [patients, search]);

  const topRef = useRef(null);
  const [targetOffset, setTargetOffset] = useState();
  useEffect(() => {
    setTargetOffset(topRef.current?.clientHeight);
  }, []);

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const { getItemDropDownSearchAccount } = useDropDownListPeopleItem();

  const updatePage = (page, type) => {
    if (type === "examinatedPatient") {
      setPage((prev) => ({
        ...prev,
        examinatedPatient: page,
      }));
    } else {
      setPage((prev) => ({
        ...prev,
        allPatient: page,
      }));
    }
  };

  const callAPI = async () => {
    try {
      axiosClient.application.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.getItem("accessToken")}`;
      const resAllPatient = await patientAPI.getAllPatients();
      const resExaminatedPatient = await patientAPI.getExaminatedPatients();

      if (resAllPatient && resAllPatient.data) {
        setPatients(resAllPatient.data);
        setTotal((prev) => ({
          ...prev,
          allPatient: resAllPatient.data.length,
        }));
      }

      if (resExaminatedPatient && resExaminatedPatient.data) {
        setListExaminatedPatients(resExaminatedPatient.data);
        setTotal((prev) => ({
          ...prev,
          examinatedPatient: resExaminatedPatient.data.length,
        }));
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <div class="list-people-wrapper">
      <div class="list-people-navigation">
        <Anchor
          targetOffset={targetOffset}
          items={[
            {
              key: "examinatedPatient",
              href: "#examinatedPatient",
              title: "Bệnh nhân đã khám",
            },
            {
              key: "allPatient",
              href: "#allPatient",
              title: "Tất cả bệnh nhân",
            },
          ]}
        />
      </div>
      <div class="list-people-content-wrapper">
        <div id="search-bar" class="search-bar-wrapper" ref={topRef}>
          <h3 class="list-people-content-title">Tìm kiếm</h3>
          <Dropdown
            menu={{
              items: getItemDropDownSearchAccount(
                listPatientSearch.slice(0, 5)
              ),
            }}
            trigger={["click"]}
            placement="bottom"
            getPopupContainer={(triggerNode) =>
              triggerNode ? triggerNode.parentNode : document.body
            }
            // menu={{ items }}
            // trigger={["click"]}
          >
            <Input
              value={search}
              onChange={onChangeSearch}
              placeholder="Nhập vào tên hoặc email bệnh nhân"
              autoSize={{ minRows: 1, maxRows: 1 }}
            />
          </Dropdown>
        </div>

        {/* examinatedPatient   */}
        <div id="examinatedPatient" class="list-people-content-big-holder">
          <h3 class="list-people-content-title">Bệnh nhân đã khám</h3>
          {paginatedExaminatedPatients &&
            paginatedExaminatedPatients.length !== 0 && (
              <div class="list-people-content-grid-layout">
                {paginatedExaminatedPatients.map((patient) => (
                  <PatientCard value={patient} key={patient._id} />
                ))}
              </div>
            )}
          <PaginationComponent
            page={page.examinatedPatient}
            limit={limit}
            total={total.examinatedPatient}
            setPage={(page) => updatePage(page, "examinatedPatient")}
            setLimit={(limit) => setLimit(limit)}
          />
        </div>

        {/* All patients   */}
        <div id="allPatient" class="list-people-content-big-holder">
          <h3 class="list-people-content-title">Tất cả bệnh nhân</h3>
          {paginatedPatients && paginatedPatients.length !== 0 && (
            <>
              <div class="list-people-content-grid-layout">
                {paginatedPatients.map((patient) => (
                  <PatientCard value={patient} key={patient._id} />
                ))}
              </div>
              <PaginationComponent
                page={page.allPatient}
                limit={limit}
                total={total.allPatient}
                setPage={(page) => updatePage(page, "allPatient")}
                setLimit={(limit) => setLimit(limit)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorPatient;
