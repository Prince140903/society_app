import React, { useState, useEffect, useContext } from "react";
import "./dashboard.css";

import { Box } from "../../components";
import { DynamicIcon } from "../../constants";
import { PieChart } from "@mui/x-charts/PieChart";
import { MyContext } from "../../App";

import {
  Button,
  FormControl,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { fetchDataFromApi } from "../../utils/api";

const Dashboard = () => {
  const [loanData, setLoanData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selection, setSelection] = useState("DEFAULT");
  const getDefaultFinancialYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // January = 0, April = 3

    if (month >= 4) {
      // From April to December
      return `${year}-${year + 1}`;
    } else {
      // From January to March
      return `${year - 1}-${year}`;
    }
  };

  const [year, setYear] = useState(getDefaultFinancialYear());
  const Context = useContext(MyContext);

  useEffect(() => {
    Context.setProgress(20);
    try {
      fetchDataFromApi(
        `/api/loanData/filter?page=${page}&limit=${limit}&search=${searchQuery}&order=${selection}&year=${year}`
      ).then((res) => {
        setLoanData(res.loanData);
        setTotalRecords(res.totalRecords);
        Context.setProgress(100);
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("API returned 404: Not Found.");
        setProducts([]);
      } else {
        console.error("Error fetching search results:", error);
      }
    }
  }, [searchQuery, page, limit, selection, year]);

  const desktopOS = [
    { id: "Windows", value: 50 },
    { id: "macOS", value: 30 },
    { id: "Linux", value: 20 },
  ];

  const handleSelection = (event) => {
    setSelection(event.target.value);
    setPage(1);
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
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const valueFormatter = (value) => `${value}%`;

  return (
    <>
      <div className="right-content w-100 ">
        <div className="row boxRow">
          <div className="col-md-8">
            <div className="boxWrapper d-flex">
              <Box
                choice={true}
                color={["#1da256", "#48d483"]}
                grow={true}
                icon={<DynamicIcon iconName="AccountCircleOutlined" />}
              />
              <Box
                choice={true}
                color={["#c012e2", "#eb64fe"]}
                icon={<DynamicIcon iconName="ShoppingCartOutlined" />}
              />
              <Box
                choice={true}
                color={["#2c78e5", "#60aff5"]}
                icon={<DynamicIcon iconName="LocalMallOutlined" />}
              />
              <Box
                choice={true}
                grow={true}
                color={["#e1950e", "#f3cd29"]}
                icon={<DynamicIcon iconName="StarsOutlined" />}
              />
            </div>
          </div>

          <div className="col-md-4 pl-0">
            <div className="box graphBox">
              <div className="w-100 bottomEle">
                <h6 className="text-white mb-0">Total Sales</h6>
                <h2 className="text-white">₹3,00,000</h2>
                <PieChart
                  series={[
                    {
                      data: desktopOS,
                      highlightScope: { fade: "global", highlight: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                      valueFormatter,
                    },
                  ]}
                  height={200}
                  width={400}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3">
          <h3 className="hd">Members List</h3>

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
                  <MenuItem value="2025-2026">2025-2026</MenuItem>
                  <MenuItem value="2024-2025">2024-2025</MenuItem>
                  <MenuItem value="2023-2024">2023-2024</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-md-3">
              <h4>Sort by</h4>
              <FormControl size="small" className="w-100">
                <Select
                  labelId="select3-label"
                  id="select3"
                  value={selection}
                  onChange={handleSelection}
                  className="w-100 drop"
                >
                  <MenuItem value="DEFAULT">Default</MenuItem>
                  <MenuItem value="ASC">Ascending</MenuItem>
                  <MenuItem value="DESC">Descending</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-md-3">
              <h4>Search by</h4>
              <FormControl size="small" className="w-100 form-group">
                <input
                  type="text"
                  name="search"
                  placeholder="Enter name"
                  onChange={handleSearch}
                  value={searchQuery}
                />
              </FormControl>
            </div>
          </div>

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
                {loanData.length !== 0 ? (
                  loanData.map((data, index) => {
                    return (
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
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td>No Data Found</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            <div className="d-flex tableFooter">
              <p>
                showing <b>{loanData.length}</b> results
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
