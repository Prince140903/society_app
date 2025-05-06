import React, { useState, useContext, useEffect } from "react";

import {
  Button,
  Breadcrumbs,
  styled,
  emphasize,
  Chip,
  MenuItem,
  FormControl,
  Select,
  Pagination,
} from "@mui/material";
import { DynamicIcon } from "../../../constants";
import { fetchDataFromApi, deleteData, postData } from "../../../utils/api";
import { MyContext } from "../../../App";
import { SelectOption } from "../../../components";

const getDefaultFinancialYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (month >= 4) {
    // From April to December
    return `${year}-${year + 1}`;
  } else {
    // From January to March
    return `${year - 1}-${year}`;
  }
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AddRecords = () => {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [table, setTable] = useState(false);
  const [year, setYear] = useState(getDefaultFinancialYear() || "");
  const [month, setMonth] = useState("April");
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalMembers, setTotalMembers] = useState(0);

  const Context = useContext(MyContext);

  useEffect(() => {
    Context.setProgress(20);
    try {
      fetchDataFromApi(
        `/api/members/filter?page=${page}&limit=${limit}&search=${searchQuery}`
      ).then((res) => {
        setMembers(res.members);
        setTotalMembers(res.totalMembers);
        Context.setProgress(100);
      });
    } catch (err) {
      console.log(err);
    }
  }, [searchQuery, page, limit]);

  const handleGenerate = (e) => {
    setTable(true);
  };

  const handleSelectChange = (memberId, field, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
      },
    }));
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      "&:hover, &:focus": {
        backgroundColor: emphasize(backgroundColor, 0.06),
      },
      "&:active": {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12),
      },
    };
  });

  return (
    <>
      <div className="w-100 right-content">
        <div className="card shadow border-0 w-100 flex-row p-4 m-0">
          <h5 className="mb-0">Add Records</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<DynamicIcon iconName="Home" />}
            />
            <StyledBreadcrumb href="/" label="Records" />
            <StyledBreadcrumb
              component="a"
              href="/add-records"
              label="Add Records"
            />
          </Breadcrumbs>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card p-4">
              <h5>Basic Information</h5>
              <div className="row cardFilters mt-3">
                <div className="col-md-3">
                  <h4>Show by</h4>
                  <FormControl size="small" className="w-100">
                    <Select
                      labelId="select1-label"
                      id="select1"
                      value={limit}
                      onChange={handleLimitChange}
                      className="w-100 drop"
                      disabled={table}
                    >
                      <MenuItem value={5}>Five</MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={15}>Fifteen</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3">
                  <h4>Select Financial Year</h4>
                  <FormControl size="small" className="w-100">
                    <Select
                      labelId="select2-label"
                      id="select2"
                      value={year}
                      onChange={handleYearChange}
                      className="w-100 drop"
                      disabled={table}
                    >
                      <MenuItem value="2025-2026">2025-2026</MenuItem>
                      <MenuItem value="2024-2025">2024-2025</MenuItem>
                      <MenuItem value="2023-2024">2023-2024</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3">
                  <h4>Select Month</h4>
                  <FormControl size="small" className="w-100">
                    <Select
                      value={month}
                      onChange={handleMonthChange}
                      className="drop"
                      disabled={table}
                    >
                      {months?.map((m, index) => (
                        <MenuItem value={m} key={index}>
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="row cardFilters mt-4">
                <div className="col-md-12 d-flex justify-content-center">
                  <Button
                    className={`btn-blue ${table === false ? "" : "disabled"}`}  
                    onClick={() => handleGenerate()}
                    disabled={table}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              {table === true ? (
                <>
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered v-align">
                      <thead className="thead-dark">
                        <tr>
                          <th>DATE</th>
                          <th>ID</th>
                          <th>NAME</th>
                          <th>SHARE MONEY</th>
                          <th>OPENING DEPOSIT</th>
                          <th>CUMULATIVE DEPOSIT</th>
                          <th>M TERM LOAN</th>
                          <th>E TERM LOAN</th>
                          <th>M INSTALLMENTS</th>
                          <th>E INSTALLMENTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members?.length !== 0 ? (
                          members.map((member) => {
                            return (
                              <tr key={member.member_id}>
                                <td>
                                  {month} {year}
                                </td>
                                <td>{member.member_id}</td>
                                <td>{member.name}</td>
                                {/* Share Money */}
                                <td>
                                  <SelectOption
                                    field="share_money"
                                    value={
                                      selectedOptions[member.member_id]
                                        ?.share_money || "0"
                                    }
                                    onChange={(field, val) =>
                                      handleSelectChange(
                                        member.member_id,
                                        field,
                                        val
                                      )
                                    }
                                  />
                                </td>
                                {/* Opening Deposit */}
                                <td>
                                  <SelectOption
                                    field="O_Deposit"
                                    value={
                                      selectedOptions[member.member_id]
                                        ?.O_Deposit || "0"
                                    }
                                    onChange={(field, val) =>
                                      handleSelectChange(
                                        member.member_id,
                                        field,
                                        val
                                      )
                                    }
                                  />
                                </td>
                                {/* Cumulative Deposit */}
                                <td>
                                  <SelectOption
                                    field="C_Deposit"
                                    value={
                                      selectedOptions[member.member_id]
                                        ?.C_Deposit || "0"
                                    }
                                    onChange={(field, val) =>
                                      handleSelectChange(
                                        member.member_id,
                                        field,
                                        val
                                      )
                                    }
                                  />
                                </td>
                                {/* M Term Loan */}
                                <td>
                                  <SelectOption
                                    field="M_Loan"
                                    value={
                                      selectedOptions[member.member_id]
                                        ?.M_Loan || "0"
                                    }
                                    onChange={(field, val) =>
                                      handleSelectChange(
                                        member.member_id,
                                        field,
                                        val
                                      )
                                    }
                                  />
                                </td>
                                {/* E Term Loan */}
                                <td>
                                  <SelectOption
                                    field="E_Loan"
                                    value={
                                      selectedOptions[member.member_id]
                                        ?.E_Loan || "0"
                                    }
                                    onChange={(field, val) =>
                                      handleSelectChange(
                                        member.member_id,
                                        field,
                                        val
                                      )
                                    }
                                  />
                                </td>
                                {/* M Installments */}
                                <td>
                                  <SelectOption
                                    field="M_Installs"
                                    value={
                                      selectedOptions[member.member_id]
                                        ?.M_Installs || "0"
                                    }
                                    onChange={(field, val) =>
                                      handleSelectChange(
                                        member.member_id,
                                        field,
                                        val
                                      )
                                    }
                                  />
                                </td>
                                {/* E Installments */}
                                <td>
                                  <SelectOption
                                    field="E_Installs"
                                    value={
                                      selectedOptions[member.member_id]
                                        ?.E_Installs || "0"
                                    }
                                    onChange={(field, val) =>
                                      handleSelectChange(
                                        member.member_id,
                                        field,
                                        val
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">
                              NO DATA FOUND
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex tableFooter">
                    {/* <p>
                  showing <b>{activeMemberData && activeMemberData.length}</b>{" "}
                  results
                </p> */}
                    <Pagination
                      count={Math.ceil(totalMembers / limit)}
                      page={page}
                      onChange={handlePageChange}
                      variant="outlined"
                      color="primary"
                      showFirstButton
                      showLastButton
                      className="ml-auto"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h1>Hello</h1>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRecords;
