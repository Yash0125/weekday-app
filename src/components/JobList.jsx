
import  { useState, useEffect, useRef } from "react";

const JobList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const observer = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const body = JSON.stringify({
        limit: 10,
        offset: (currentPage - 1) * 10,
      });

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
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(prevData => [...prevData, ...result.jdList]);
      setCurrentPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

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
  }, [loading, currentPage]);

  return (
    <div>
      <h1>Job Cards</h1>
      <div className="job-card-container">
        {data.map((job, index) => (
          <div key={index} className="job-card">
            <h2>{job.jobRole}</h2>
            <h3>{job.companyName}</h3>
            <p>Location: {job.location}</p>
            <p>Description: {job.jobDetailsFromCompany}</p>
            <p>Experience: {job.minExp} - {job.maxExp} years</p>
            <a href={job.jdLink}>Apply Now</a>
          </div>
        ))}
        {loading && <p>Loading...</p>}
        <div id="observer" style={{ height: "10px" }}></div>
      </div>
    </div>
  );
};

export default JobList;

