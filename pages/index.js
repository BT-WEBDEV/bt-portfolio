import Head from 'next/head'
import * as React from 'react';

// Material UI
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography';


//Components
import SkillsBox from '../components/skills/skillsBox.js';
import SkeletonLoading from '../components/skeletonLoading.js';

//Hooks
import useContentful from '../hooks/use-contenful';

const query = ` {
  skillsCollection {
    items {
      slug
      name
      usage
      image {
        url
      }
    }
  }
}
`

const drawerWidth = 240;

export default function Home() {
  
  let {data, errors} = useContentful(query)

  if (errors) {
    return <span style={{color:"red"}}> {errors.map(error => error.message).join(",")} </span>
  }

  //Skeleton
  if (!data) { 
    return <SkeletonLoading />;
  }

  return (
      <>
      <Head>
        <title>Home - Brandon Tetrick</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Box sx={{ display: 'flex' }}>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Typography 
            variant="h1" 
            align="center"
          >
            Brandon Tetrick
          </Typography>

          <Typography 
            paragraph align="center"
          >
           Results-driven web developer with over 7 years of experience spanning diverse projects in both public and private sectors. 
           Specializing in developing dynamic websites that blend creativity and cutting-edge technology. 
           Adept at implementing strategic digital marketing initiatives that have led to a 25% average increase in website traffic across various projects. 
           Lifelong learner deeply passionate about web development and digital innovation.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row', xl: 'row' }}
            spacing={2} 
            justifyContent="center" 
            sx={{
              m: 5
            }}
          > 
            <Typography 
              variant="h4" 
              align="center"
            >
            Check out my: 
            </Typography>
            <Link href="/experience" underline="hover" variant="h4" color="inherit" sx={{textAlign: 'center'}}>
              Experience
            </Link>
            <Link href="/portfolio" underline="hover" variant="h4" color="inherit" sx={{textAlign: 'center'}}>
              Portfolio
            </Link>

          </Stack>
          
          <Divider/> 

          <Typography 
            variant="h4" 
            align="center"
            sx= {{
              mt: 5
            }}
          >
            My Skill Set
          </Typography>

          <SkillsBox data={data} />
        </Box>
      </Box>  
      </>
  )
}
