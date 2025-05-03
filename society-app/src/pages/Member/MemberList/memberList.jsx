import React, { useState, useEffect, useContext } from "react";
import "./memberList.css";

import { DynamicIcon } from "../../../constants";
import { Box } from "../../../components";
import {
  Breadcrumbs,
  styled,
  emphasize,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  Button,
} from "@mui/material";
import { fetchDataFromApi, deleteData } from "../../../utils/api";
import { MyContext } from "../../../App";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selection, setSelection] = useState("DEFAULT");
  const Context = useContext(MyContext);

  useEffect(() => {
    Context.setProgress(20);
    try {
      fetchDataFromApi(
        `/api/members/filter?page=${page}&limit=${limit}&search=${searchQuery}&order=${selection}`
      ).then((res) => {
        setMembers(res.members);
        setTotalMembers(res.totalMembers);
        Context.setProgress(100);
      });
    } catch (err) {
      console.log(err);
    }
  }, [searchQuery, page, limit, selection]);

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

  const deleteMem = (id) => {
    Context.setProgress(30);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );
    if (!confirmDelete) return;

    deleteData(`/api/members/delete`, { member_id: id })
      .then((res) => {
        Context.setProgress(100);
        fetchDataFromApi(
          `/api/members/filter?page=${page}&limit=${limit}&search=${searchQuery}&order=${selection}`
        ).then((res) => {
          setMembers(res);
          Context.setProgress(100);
          Context.setAlertBox({
            open: true,
            error: false,
            msg: "Member Deleted!",
          });
        });
      })
      .catch((error) => {
        console.error("Error deleting member:", error);
      });
  };

  return (
    <>
      <div className="right-content w-100 ">
        <div className="card shadow border-0 w-100 flex-row p-4 m-0">
          <h5 className="mb-0">Members List</h5>
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
              href="/member-list"
              label="Member List"
            />
          </Breadcrumbs>
        </div>

        <div className="row pt-4 pb-4">
          <div className="col-md-4">
            <Box
              color={["#64b3f6", "#2b77e5"]}
              icon={
                <DynamicIcon
                  iconName="ShoppingBag"
                  style={{ color: "#96cefa" }}
                />
              }
            />
          </div>
          <div className="col-md-4">
            <Box
              color={["#ed68ff", "#be0ee1"]}
              icon={
                <DynamicIcon iconName="Category" style={{ color: "#f3a0ff" }} />
              }
            />
          </div>
          <div className="col-md-4">
            <Box
              color={["#4eda89", "#1a9f53"]}
              icon={
                <DynamicIcon iconName="Beenhere" style={{ color: "#89ecb3" }} />
              }
            />
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-0">
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
                  <th>MEMBER_ID</th>
                  <th>MEMBER NAME</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {members?.length !== 0 ? (
                  members?.map((member) => {
                    return (
                      <tr key={member.member_id} style={{ width: "10%" }}>
                        <td>{member.member_id}</td>
                        <td>{member.name}</td>
                        <td style={{ width: "20%" }}>
                          <Button color="secondary" className="secondary">
                            <DynamicIcon iconName="Visibility" />
                          </Button>
                          <Button color="success" className="success">
                            <DynamicIcon iconName="Create" />
                          </Button>
                          <Button
                            color="error"
                            className="error"
                            onClick={() => deleteMem(member.member_id)}
                          >
                            <DynamicIcon iconName="Delete" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td>
                        <b>No Data Found</b>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            <div className="d-flex tableFooter">
              <p>
                showing <b>{members.length}</b> results
              </p>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberList;
