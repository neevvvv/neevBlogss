import React from "react";
import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Logo from "../Logo";

export default function Footer() {
  const theme = useTheme();
  const footerBg =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.background.paper;
  const linkSx = {
    display: "block",
    mb: 1,
    color:
      theme.palette.mode === "light"
        ? theme.palette.text.primary
        : theme.palette.common.white,
    textDecoration: "none",
    "&:hover": { color: theme.palette.primary.main },
  };

  const footerLinks = {
    Company: ["Features", "Pricing", "Affiliate Program", "Press Kit"],
    Support: ["Account", "Help", "Contact Us", "Customer Support"],
    Legals: ["Terms & Conditions", "Privacy Policy", "Licensing"],
  };
  const supportEmail = "borbanayush09@gmail.com";

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: footerBg,
        borderTop: 1,
        borderColor: "divider",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={3}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              <Logo width="80px" />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                © {new Date().getFullYear()}. All Rights Reserved.
              </Typography>
            </Box>
          </Grid>

          {Object.entries(footerLinks).map(([group, links]) => (
            <Grid item xs={12} sm={4} md={3} key={group}>
              <Typography
                variant="overline"
                gutterBottom
                color="text.secondary"
              >
                {group}
              </Typography>
              {links.map((link) => {
                const href =
                  group === "Support" && link !== "Account"
                    ? `mailto:${supportEmail}?subject=${encodeURIComponent(
                        link
                      )}`
                    : "#";
                return (
                  <MuiLink key={link} href={href} sx={linkSx}>
                    {link}
                  </MuiLink>
                );
              })}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
