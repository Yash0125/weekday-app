import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import JobCard from "./JobCard"; 

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
        ? job.location.toLowerCase().includes(filters.locationFilter.toLowerCase())
        : true;
    const remoteFilter =
      filters.remoteFilter !== "" ? job.location.toLowerCase() === filters.remoteFilter : true;
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
      <Grid container spacing={3}  style={{marginTop:"40px"}}>
         <Grid item xs={12} sm={6}>
           <TextField
            name="selectedExperience"
            label="Select Experience"
            variant="outlined"
            select
            fullWidth
            value={filters.selectedExperience}
            onChange={handleFilterChange}
          >
            <MenuItem value="">Select Experience</MenuItem>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((exp) => (
              <MenuItem key={exp} value={exp}>
                {exp} years
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} >
          <TextField
            name="companyNameFilter"
            label="Enter Company Name"
            variant="outlined"
            fullWidth
            value={filters.companyNameFilter}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="locationFilter"
            label="Enter Location"
            variant="outlined"
            fullWidth
            value={filters.locationFilter}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Select Location</InputLabel>
            <Select
              name="remoteFilter"
              value={filters.remoteFilter}
              onChange={handleFilterChange}
              label="Select Location"
            >
              <MenuItem value="">Select Location</MenuItem>
              <MenuItem value="remote">Remote</MenuItem>
              <MenuItem value="onsite">On-site</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="roleFilter"
            label="Enter Job Role"
            variant="outlined"
            fullWidth
            value={filters.roleFilter}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Select Min Base Pay</InputLabel>
            <Select
              name="minBasePayFilter"
              value={filters.minBasePayFilter}
              onChange={handleFilterChange}
              label="Select Min Base Pay"
            >
              <MenuItem value="">Select Min Base Pay</MenuItem>
              {["10k", "20k", "30k", "40k", "50k", "60k", "70k", "80k", "90k", "100k+"].map(
                (salary) => (
                  <MenuItem key={salary} value={salary}>
                    {salary}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={8} style={{ marginTop: "40px" }}>
        {/* Job Cards */}
        {filteredData.map((job, index) => (
          <JobCard
            key={index}
            job={job} // Pass the job object as a prop
            handleOpenModal={handleOpenModal} // Pass the handleOpenModal function as a prop
          />
        ))}
      </Grid>
      {loading && (
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
