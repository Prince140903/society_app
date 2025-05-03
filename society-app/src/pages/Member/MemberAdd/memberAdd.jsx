import React, { useState, useContext, useEffect } from "react";
import "./memberAdd.css";

import { Button, Breadcrumbs, styled, emphasize, Chip } from "@mui/material";
import { DynamicIcon } from "../../../constants";
import { MyContext } from "../../../App";
import { postData } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const MemberAdd = () => {
  const [name, setName] = useState("");
  const Context = useContext(MyContext);
  const history = useNavigate();

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      Context.setAlertBox({
        msg: "Please enter a Name",
        error: true,
        open: true,
      });
      return;
    }

    try {
      postData("/api/members/add", { name }).then((res) => {
        setName("");

        Context.setAlertBox({
          open: true,
          error: false,
          msg: "Member added successfully",
        });
        history("/member-list");
      });
    } catch (error) {
      Context.setAlertBox({
        msg: "Error connecting to the server.",
        error: true,
        open: true,
      });
      console.error("Error:", error);
    }
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
          <h5 className="mb-0">Add Member</h5>
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
              href="/member-add"
              label="Add Member"
            />
          </Breadcrumbs>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card p-4">
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>MEMBER NAME</label>
                  <input
                    type="text"
                    placeholder="Type here"
                    value={name}
                    name="name"
                    autoComplete="off"
                    onChange={handleInputChange}
                  />
                  <Button className="mt-3 btn-blue" type="submit">
                    ADD
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberAdd;
