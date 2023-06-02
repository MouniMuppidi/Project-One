import * as React from "react";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Box,
  Container,
  Toolbar,
  Typography,
  AppBar,
  useScrollTrigger,
  CssBaseline,
  Button,
} from "@mui/material";
import FinancialChart from "./components/FinancialChart";

const ElevationScroll = (props) => {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

const App = (props) => {
  const [details, setDetails] = React.useState({
    clientName: "",
    currentAge: 0,
    currentNestEgg: 0,
    averageAnnualRateReturn: 0,
    currentSalary: 0,
    yearlyContributionTowardsRetirement: 0,
    yearlySalaryIncrease: 0,
    yearsToRetirement: 0,
    activeYearsRetirement: 0,
    desiredIncomeAtActiveYears: 0,
    desiredIncomeAfterActiveYears: 0,
  });
  const [error, setError] = React.useState(false);
  const [retirementArray, setRetirementArray] = React.useState([]);
  const [years, setYears] = React.useState([]);
  const [retirementAmount, setRetirementAmount] = React.useState(0);
  const [totalRetirementAmount, setTotalRetirementAmount] = React.useState(0);

  const handleChange = (name, value) => {
    setError(false);
    if (name !== "clientName") {
      setDetails((values) => {
        return { ...values, [name]: Number(value) };
      });
    } else {
      setDetails((values) => {
        return { ...values, [name]: value };
      });
    }
  };

  const findAccumulatedSumBeforeRetirement = (
    previousContribution,
    currentContribution
  ) => {
    let contribution = previousContribution + currentContribution;
    let yearlyReturn = contribution * (details.averageAnnualRateReturn / 100);
    setTotalRetirementAmount((value) => value + contribution + yearlyReturn);
    return contribution + yearlyReturn;
  };

  const findAccumulatedSumAfterRetirement = (
    previousContribution,
    currentContribution
  ) => {
    let contribution = previousContribution - currentContribution;
    let yearlyReturn = contribution * (details.averageAnnualRateReturn / 100);
    setTotalRetirementAmount((value) => value + yearlyReturn);
    return contribution + yearlyReturn;
  };

  const handleSubmit = () => {
    if (
      details.clientName === "" ||
      details.currentAge === 0 ||
      details.currentSalary === 0 ||
      details.yearlyContributionTowardsRetirement === 0 ||
      details.yearsToRetirement === 0 ||
      details.activeYearsRetirement === 0 ||
      details.desiredIncomeAtActiveYears === 0 ||
      details.desiredIncomeAfterActiveYears === 0
    ) {
      setError(true);
      window.alert("Please fill required fields");
      return;
    }
    setTotalRetirementAmount(0);
    let currentSalary = details.currentSalary;
    let currentYearRetirementAmount = findAccumulatedSumBeforeRetirement(
      details.currentNestEgg,
      currentSalary * (details.yearlyContributionTowardsRetirement / 100)
    );
    let retirementArray = [currentYearRetirementAmount];
    let years = [new Date().getFullYear() + 1];
    let year = 1;
    let activeYear = 0;
    let currentAge = details.currentAge + 1;

    while (currentAge <= 100 && currentYearRetirementAmount > 0) {
      // console.log("values", {
      //   amount: currentYearRetirementAmount,
      //   year: years[years.length - 1],
      //   currentAge: currentAge,
      // });
      if (year < details.yearsToRetirement) {
        if (details.yearlySalaryIncrease > 0) {
          currentSalary =
            currentSalary +
            currentSalary * (details.yearlySalaryIncrease / 100);
        }
        currentYearRetirementAmount = findAccumulatedSumBeforeRetirement(
          retirementArray[retirementArray.length - 1],
          currentSalary * (details.yearlyContributionTowardsRetirement / 100)
        );
        setRetirementAmount(currentYearRetirementAmount);
        retirementArray.push(currentYearRetirementAmount);
        year = year + 1;
      } else if (activeYear < details.activeYearsRetirement) {
        currentYearRetirementAmount = findAccumulatedSumAfterRetirement(
          retirementArray[retirementArray.length - 1],
          details.desiredIncomeAtActiveYears
        );
        if (currentYearRetirementAmount > 0) {
          retirementArray.push(currentYearRetirementAmount);
        } else {
          currentYearRetirementAmount = 0;
          retirementArray.push(0);
        }
        activeYear = activeYear + 1;
      } else {
        currentYearRetirementAmount = findAccumulatedSumAfterRetirement(
          retirementArray[retirementArray.length - 1],
          details.desiredIncomeAfterActiveYears
        );
        if (currentYearRetirementAmount > 0) {
          retirementArray.push(currentYearRetirementAmount);
        } else {
          currentYearRetirementAmount = 0;
          retirementArray.push(0);
        }
        activeYear = activeYear + 1;
      }
      currentAge = currentAge + 1;
      years.push(years[years.length - 1] + 1);
    }
    setRetirementArray(retirementArray);
    setYears(years);
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  console.log("values", totalRetirementAmount);

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h6" component="div" fontSize={"32px"}>
              Retirement Calculator
            </Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "70%",
          }}
        >
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Client name
            </InputLabel>
            <OutlinedInput
              error={error && details["clientName"] === ""}
              name="clientName"
              value={details["clientName"]}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. Chandler Bing"
              sx={{
                "& .MuiInputBase-input": {
                  padding: "9px 15px",
                },
                width: "50%",
              }}
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Current age
            </InputLabel>
            <OutlinedInput
              error={error && details["currentAge"] === 0}
              type="number"
              name="currentAge"
              value={details["currentAge"] === 0 ? "" : details["currentAge"]}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 30"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 15px",
                },
                width: "50%",
              }}
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Current retirement nest egg
            </InputLabel>
            <OutlinedInput
              type="number"
              name="currentNestEgg"
              value={
                details["currentNestEgg"] === 0 ? "" : details["currentNestEgg"]
              }
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 1000"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 5px",
                },
                width: "50%",
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ marginRight: "0px" }}>
                  $
                </InputAdornment>
              }
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Average annual rate of return
            </InputLabel>
            <OutlinedInput
              type="number"
              name="averageAnnualRateReturn"
              value={
                details["averageAnnualRateReturn"] === 0
                  ? ""
                  : details["averageAnnualRateReturn"]
              }
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 4"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 5px",
                },
                paddingLeft: "10px",
                width: "50%",
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ marginRight: "0px" }}>
                  %
                </InputAdornment>
              }
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Current salary
            </InputLabel>
            <OutlinedInput
              error={error && details["currentSalary"] === 0}
              type="number"
              name="currentSalary"
              value={
                details["currentSalary"] === 0 ? "" : details["currentSalary"]
              }
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 40000"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 5px",
                },
                paddingLeft: "10px",
                width: "50%",
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ marginRight: "0px" }}>
                  $
                </InputAdornment>
              }
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Yearly contribution rate towards retirement
            </InputLabel>
            <OutlinedInput
              error={
                error && details["yearlyContributionTowardsRetirement"] === 0
              }
              type="number"
              name="yearlyContributionTowardsRetirement"
              value={
                details["yearlyContributionTowardsRetirement"] === 0
                  ? ""
                  : details["yearlyContributionTowardsRetirement"]
              }
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 4"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 5px",
                },
                paddingLeft: "10px",
                width: "50%",
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ marginRight: "0px" }}>
                  %
                </InputAdornment>
              }
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Estimated yearly salary increase
            </InputLabel>
            <OutlinedInput
              type="number"
              name="yearlySalaryIncrease"
              value={
                details["yearlySalaryIncrease"] === 0
                  ? ""
                  : details["yearlySalaryIncrease"]
              }
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 4"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 5px",
                },
                paddingLeft: "10px",
                width: "50%",
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ marginRight: "0px" }}>
                  %
                </InputAdornment>
              }
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Number of years to retirement
            </InputLabel>
            <OutlinedInput
              error={error && details["yearsToRetirement"] === 0}
              type="number"
              name="yearsToRetirement"
              value={
                details["yearsToRetirement"] === 0
                  ? ""
                  : details["yearsToRetirement"]
              }
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 30"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 15px",
                },
                width: "50%",
              }}
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Number of active years in retirement
            </InputLabel>
            <OutlinedInput
              error={error && details["activeYearsRetirement"] === 0}
              type="number"
              name="activeYearsRetirement"
              value={
                details["activeYearsRetirement"] === 0
                  ? ""
                  : details["activeYearsRetirement"]
              }
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 15"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 15px",
                },
                width: "50%",
              }}
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Desired income at retirement for active years
            </InputLabel>
            <OutlinedInput
              error={error && details["desiredIncomeAtActiveYears"] === 0}
              type="number"
              name="desiredIncomeAtActiveYears"
              value={
                details["desiredIncomeAtActiveYears"] === 0
                  ? ""
                  : details["desiredIncomeAtActiveYears"]
              }
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 4000"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 5px",
                },
                width: "50%",
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ marginRight: "0px" }}>
                  $
                </InputAdornment>
              }
            />
          </Box>
          <Box
            sx={{
              margin: "15px 0px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputLabel
              sx={{
                fontWeight: "bold",
                opacity: "1",
                width: "45%",
                textAlign: "right",
                textOverflow: "initial",
                whiteSpace: "normal",
              }}
            >
              Desired income at retirement after active years
            </InputLabel>
            <OutlinedInput
              error={error && details["desiredIncomeAfterActiveYears"] === 0}
              type="number"
              name="desiredIncomeAfterActiveYears"
              value={
                details["desiredIncomeAfterActiveYears"] === 0
                  ? ""
                  : details["desiredIncomeAfterActiveYears"]
              }
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="e.g. 2000"
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 5px",
                },
                width: "50%",
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ marginRight: "0px" }}>
                  $
                </InputAdornment>
              }
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "20px 0px",
            }}
          >
            <Button variant="contained" onClick={handleSubmit}>
              Calculate
            </Button>
          </Box>
        </Box>
        {retirementArray.length > 0 ? (
          <Box sx={{ width: "100%", margin: "20px 0px" }}>
            <Typography sx={{ textAlign: "center", marginBottom: "10px" }}>
              Your plan provides $
              {numberWithCommas(retirementAmount.toFixed(0))} when you retire.
              <Typography>
                The maximum size of retirement savings across the entire period
                is ${numberWithCommas(Math.max(...retirementArray).toFixed(0))}
                .Total retirement dollars received is $
                {numberWithCommas(totalRetirementAmount.toFixed(0))}
              </Typography>
            </Typography>

            <FinancialChart labels={years} data={retirementArray} />
          </Box>
        ) : null}
      </Container>
    </React.Fragment>
  );
};

export default App;
