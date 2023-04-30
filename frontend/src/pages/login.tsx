import { Button, CardActions, Container, Typography } from "@mui/material"
import Paper from "@mui/material/Paper"
import CardContent from "@mui/material/CardContent"
import LoginIcon from "@mui/icons-material/Login"

import { useRouter } from "next/router"
import { retrieveUserDetailsWithEmail } from "lib/next-api"

const LoginPage = () => {
  const router = useRouter()
  const userEmail = "test_user@email.com"

  const handleClick = async () => {
    try {
      await retrieveUserDetailsWithEmail(userEmail)
    } catch (error) {
      console.error("Error logging in: ", error)
      return {
        notFound: true,
      }
    }

    router.push("/loan")
  }

  return (
    <Container
      sx={{
        width: "50%",
        height: "inherit",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{ justifyContent: "center", alignItems: "center", pb: 2, px: 2 }}
      >
        <CardContent>
          <Typography variant="h6" textAlign="center">
            Demyst Technical Test Loan App
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleClick}
            variant="contained"
            startIcon={<LoginIcon />}
          >
            {`Log in as ${userEmail}`}
          </Button>
        </CardActions>
      </Paper>
    </Container>
  )
}

export default LoginPage
