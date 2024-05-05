import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
} from "@material-ui/core";
import JobCard from "./JobCard";
import Filter from "./Filter";

const JobList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState({
    selectedExperience: "",
    companyNameFilter: "",
    locationFilter: "",
    remoteFilter: "",
    roleFilter: "",
    minBasePayFilter: "",
  });
  const observer = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const filterParams = {
        limit: 10,
        offset: (currentPage - 1) * 10,
        ...filters,
      };

      const body = JSON.stringify(filterParams);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body,
      };

      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setData((prevData) => [...prevData, ...result.jdList]);
      setCurrentPage((prevPage) => prevPage + 1);

      if (result.jdList.length === 0) {
        setLoading(false);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    if (!loading && observer.current) {
      observer.current.disconnect();
    }
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchData();
      }
    }, options);

    if (observer.current) {
      observer.current.observe(document.querySelector("#observer"));
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, currentPage, filters]);

  const handleOpenModal = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredData = data.filter((job) => {
    const experienceFilter =
      filters.selectedExperience !== ""
        ? job.minExp <= parseInt(filters.selectedExperience)
        : true;
    const companyFilter =
      filters.companyNameFilter !== ""
        ? job.companyName
            .toLowerCase()
            .includes(filters.companyNameFilter.toLowerCase())
        : true;
    const locationFilter =
      filters.locationFilter !== ""
        ? job.location
            .toLowerCase()
            .includes(filters.locationFilter.toLowerCase())
        : true;
    const remoteFilter =
      filters.remoteFilter !== ""
        ? job.location.toLowerCase() === filters.remoteFilter
        : true;
    const roleFilter =
      filters.roleFilter !== ""
        ? job.jobRole.toLowerCase().includes(filters.roleFilter.toLowerCase())
        : true;
    const minBasePayFilter =
      filters.minBasePayFilter !== ""
        ? job.minJdSalary >= parseInt(filters.minBasePayFilter.replace("k", ""))
        : true;
    return (
      experienceFilter &&
      companyFilter &&
      locationFilter &&
      remoteFilter &&
      roleFilter &&
      minBasePayFilter
    );
  });

  return (
    <Container>
      <Typography variant="h1" style={{ fontSize: "65px" }} gutterBottom>
        Weekday
      </Typography>
      <Filter filters={filters} handleFilterChange={handleFilterChange} />
      <Grid container spacing={8} style={{ marginTop: "40px" }}>
        {filteredData.length > 0 &&
          filteredData.map((job, index) => (
            <JobCard key={index} job={job} handleOpenModal={handleOpenModal} />
          ))}
      </Grid>
      {filteredData.length > 0 && loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      )}
      {filteredData.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <Typography
            variant="body1"
            style={{ fontWeight: "bold", fontSize: "24px" }}
          >
            No result found
          </Typography>
        </div>
      )}
      <div id="observer" style={{ height: "3rem" }}></div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={openModal}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "5px",
              maxWidth: "600px",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Full Job Description
            </Typography>
            <Typography variant="body1">
              {selectedJob && selectedJob.jobDetailsFromCompany}
            </Typography>
          </div>
        </Fade>
      </Modal>
    </Container>
  );
};

export default JobList;