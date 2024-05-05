import {
  Card,
  CardContent,
  Typography,
  Link,
  Grid,
} from "@material-ui/core";

const JobCard = ({ job, handleOpenModal ,index}) => {
  return (
    <Grid item key={index} xs={12} sm={6} md={4}>
    <Card className="job-card" style={{ marginBottom: "10px" }}>
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          style={{ color: "rgb(139, 139, 139)" }}
        >
          {job.companyName}
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          gutterBottom
          style={{ color: "rgba(0, 0, 0, 0.87)" }}
        >
          {job.jobRole.charAt(0).toUpperCase() + job.jobRole.slice(1)}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          style={{
            fontWeight: 500,
            color: "#000000de",
            fontSize: "16px",
            lineHeight: "20px",
          }}
        >
          {job.location.charAt(0).toUpperCase() + job.location.slice(1)}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          style={{
            fontWeight: 500,
            color: "rgb(77, 89, 106)",
            fontSize: "16px",
            lineHeight: "20px",
            marginTop: "1rem",
          }}
        >
          Estimated Salary: {job.minJdSalary ? job.minJdSalary : 0}k - {job.maxJdSalary}k USD ⚠️
        </Typography>
        <Typography
          variant="body2"
          component="h3"
          style={{
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "20px",
            marginTop: "1rem",
          }}
        >
          Description:
        </Typography>
        <Typography
          variant="body2"
          component="h3"
          style={{
            maxHeight: "160px",
            overflow: "hidden",
            position: "relative",
            marginTop: "5px",
          }}
        >
          {job.jobDetailsFromCompany}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              textAlign: "center",
              background:
                "linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 1))",
            }}
          >
            <Link
              variant="body2"
              onClick={() => handleOpenModal(job)}
              style={{
                textDecoration: "none",
                color: "#007bff",
                cursor: "pointer",
                fontWeight: "500",
                backgroundColor: "#fff"
              }}
            >
              View More
            </Link>
          </div>
        </Typography>
        <Typography
          variant="body2"
          component="p"
          style={{
            fontWeight: 600,
            color: "rgb(139, 139, 139)",
            fontSize: "16px",
            lineHeight: "20px",
            marginTop: "1rem",
          }}
        >
          Min Experience:
        </Typography>
        <Typography
          variant="body2"
          component="p"
          style={{
            fontWeight: 400,
            color: "rgba(0, 0, 0, 0.87)",
            fontSize: "16px",
            lineHeight: "20px",
            marginTop: "0.5rem",
          }}
        >
          {job.minExp === null ? 0 : job.minExp} years
        </Typography>
        <div
          style={{
            width: "100%",
            backgroundColor: "#55EFC4",
            margin: "1rem auto",
            textAlign: "center",
            borderRadius: "5px",
          }}
        >
          <Link
            href={job.jdLink}
            variant="body2"
            style={{
              color: "rgb(0, 0, 0)",
              textDecoration: "none",
              display: "block",
              padding: "10px",
            }}
          >
            ⚡ Easy Apply
          </Link>
        </div>
      </CardContent>
    </Card>
    </Grid>
  );
};

export default JobCard;
