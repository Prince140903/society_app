import React, { useState, useContext, useEffect } from "react";
import "./memberDetails.css";

import {
  Breadcrumbs,
  styled,
  emphasize,
  Chip,
  FormControl,
  Select,
  Pagination,
  MenuItem,
} from "@mui/material";
import { DynamicIcon } from "../../../constants";
import { fetchDataFromApi } from "../../../utils/api";

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

const MemberDetails = () => {
  const [MemberData, setMemberData] = useState([]);
  const [activeMember, setActiveMember] = useState();
  const [activeMemberData, setActiveMemberData] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [year, setYear] = useState(getDefaultFinancialYear() || "");
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const Members = await fetchDataFromApi(
          `/api/members/filter?search=${searchQuery}&limit=5`
        );

        const { members, totalMembers } = Members;

        if (!members || members.length === 0) {
          setMemberData([]);
          return;
        }

        setMemberData(members);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("API returned 404: Not Found.");
          setMemberData([]);
        } else {
          console.error("Error fetching search results:", error);
        }
      }
    };

    fetchMembers();
  }, [searchQuery]);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        if (activeMember) {
          const MemberData = await fetchDataFromApi(
            `/api/loanData/filter?member_id=${activeMember}&year=${year}&limit=${limit}&page=${page}`
          );

          const { loanData, totalRecords } = MemberData;

          setActiveMemberData(loanData);
          setTotalRecords(totalRecords);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("API returned 404: Not Found.");
          setActiveMemberData([]);
        } else {
          console.error("Error fetching search results:", error);
        }
      }
    };
    fetchMemberData();
  }, [activeMember, page, year, limit]);

  const handleSelect = (data) => {
    setActiveMember(data.member_id);
    setSearchQuery("");
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
    setPage(1);
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
          <h5 className="mb-0">Member View</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<DynamicIcon iconName="Home" />}
            />
            <StyledBreadcrumb
              component="a"
              href="/member-list"
              label="Member"
            />
            <StyledBreadcrumb
              component="a"
              href="/member-details"
              label="Member View"
            />
          </Breadcrumbs>
        </div>

        <div className="card shadow border-0 p-3">
          <div className="row cardFilters mt-3">
            <div className="col-md-5">
              <h4>Search by</h4>
              <FormControl size="small" className="w-100 form-group">
                <input
                  type="text"
                  name="seach"
                  placeholder="Enter name"
                  onChange={handleSearch}
                  value={searchQuery}
                  autoComplete="off"
                />
                {searchQuery && (
                  <div className="search-dropdown">
                    {MemberData.length > 0 ? (
                      MemberData.map((data, index) => (
                        <div
                          className="search-item"
                          key={index}
                          onClick={() => handleSelect(data)}
                        >
                          {data.name}
                        </div>
                      ))
                    ) : (
                      <div className="no-results">No results found</div>
                    )}
                  </div>
                )}
              </FormControl>
            </div>
          </div>

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
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
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
                >
                  <MenuItem value="">DEFAULT</MenuItem>
                  <MenuItem value="2025-2026">2025-2026</MenuItem>
                  <MenuItem value="2024-2025">2024-2025</MenuItem>
                  <MenuItem value="2023-2024">2023-2024</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {activeMember && (
            <>
              <h3 className="hd pt-4">Member Details</h3>
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
                    {activeMemberData ? (
                      activeMemberData.map((data, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(data.record_date)
                              .toISOString()
                              .slice(0, 10)}
                          </td>
                          <td>{data.member_id}</td>
                          <td>{data.name}</td>
                          <td>{parseInt(data.share_money)}</td>
                          <td>{parseInt(data.opening_deposit)}</td>
                          <td>{parseInt(data.cummulative_deposit)}</td>
                          <td>{parseInt(data.m_term_loan)}</td>
                          <td>{parseInt(data.e_term_loan)}</td>
                          <td>{parseInt(data.m_term_installments)}</td>
                          <td>{parseInt(data.e_term_installments)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No Data Found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex tableFooter">
                <p>
                  showing <b>{activeMemberData && activeMemberData.length}</b>{" "}
                  results
                </p>
                <Pagination
                  count={Math.ceil(totalRecords / limit)}
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
          )}
        </div>
      </div>
    </>
  );
};

export default MemberDetails;
