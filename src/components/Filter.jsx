import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";

const Filter = ({ filters, handleFilterChange }) => {
  return (
    <Grid container spacing={3} style={{ marginTop: "40px" }}>
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
      <Grid item xs={12} sm={6}>
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
          label="Enter Location Like Mumbai, Delhi"
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
          label="Enter Job Role Like Frontend , IOS, Android"
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
            {[
              "10k",
              "20k",
              "30k",
              "40k",
              "50k",
              "60k",
              "70k",
              "80k",
              "90k",
              "100k+",
            ].map((salary) => (
              <MenuItem key={salary} value={salary}>
                {salary}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Filter;
