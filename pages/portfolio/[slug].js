import Head from 'next/head'
import * as React from 'react';

//Material UI 
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

//Material UI Icons
import GitHubIcon from '@mui/icons-material/GitHub';
import PublicIcon from '@mui/icons-material/Public';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

//Fancybox
import { Fancybox } from '@fancyapps/ui';

//Contentful
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

//Custom Styles
import styles from '../../styles/skill.module.css'

// Query
const query = `
query GetPortfolioItem($slug: String!) {
    portfolioCollection(where: { slug: $slug }) {
        items {
            order
            slug
            name
            description {
                json
            }
            image {
                title
                description
                contentType
                fileName
                size
                url
                width
                height
            }
            liveUrl
            githubUrl
            relatedSkillsCollection(limit: 15) {
                items {
                    ... on Skills {
                        name
                        slug
                        image {
                            url
                        }
                    }
                }
            }
            galleryCollection(limit: 15) {
                items {
                  title
                  fileName
                  url
                }
            }
            relatedExperience {
                ... on Experience {
                  name
                  slug
                            image {
                      url
                  }
                }
            }
        }
    }
}
`;


/// Get URL Path
export async function getStaticPaths() { 
    const results = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        // Authenticate the request
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CDA_TOKEN}`,
        },
        // send the GraphQL query
        body: JSON.stringify({
        query: `
            {
            portfolioCollection {
                items {
                slug
                }
            }
            }
        `,
        }),
    })
    .then((response) => response.json()); 

    const slugs = results.data.portfolioCollection.items.map(project => project.slug);

    return {
        paths: slugs.map(slug => ({ params: { slug } })),
        fallback: false,
    }
}

/// GET INFO FROM CONTENTFUL
export async function getStaticProps({ params }) {
    const data = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        // Authenticate the request
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CDA_TOKEN}`,
        },
        // send the GraphQL query
        body: JSON.stringify({ 
          query,
          variables: {
            slug: params.slug,
          },
      }),
    })
    .then((response) => response.json()); 

    return {
        props: {
          results: data,
          params,
        }
    }
}

const drawerWidth = 240;

// Portfolio Project Specific Page 
export default function Project({results, params}) {

    
    
    const project = results.data.portfolioCollection.items.find(
      item => item.slug === params.slug
    ); 

    const galleryImages = project.galleryCollection.items.map(item => ({
        title: item.title,
        fileName: item.fileName,
        url: item.url
    }));

    const relatedExperience = project.relatedExperience

    // console.log(relatedExperience)

    const numPhotos = galleryImages.length; 
  
    return (
      <>
        <Head>
          <title>{project.name}</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)`, justifyContent: 'center' } }}
            >
                {/* PROJECT NAME */}
                 <Typography 
                    variant="h2" 
                    align="center"
                    sx={{
                        p: 1,
                        mb: 2
                    }}
                >
                    Portfolio Project: {project.name}
                </Typography>
                
                <Divider/>

                {/* PROJECT GALLERY */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly', 
                        alignItems: 'center',
                        gap: '5px',
                        mt: { xs: 2, sm: 2, md: 2, lg: 0, xl: 0 },   
                        flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row', xl: 'row' }, // 
                    }}
                >

                    <Box
                        component="img"
                        sx={{
                            height: '100%',
                            width: { xs: '40%', sm: '40%', md: '40%', lg: '15%', xl: '15%' }, 
                            maxHeight: { xs: '100%', md: '100%' },
                            maxWidth: { xs: '100%', md: '40%' },
                        }}
                        src={project.image.url}
                    > 

                    </Box>

                    <ImageList
                        sx={{ 
                            width: { xs: '100%', sm: '100%', md: '100%', lg: '60%', xl: '60%' }, 
                            height: '100%', 
                            p: 2 
                        }}
                        variant="quilted"
                        cols={2}
                        rowHeight={300}
                        gap={15} 
                    >
                        {galleryImages.slice(0, 4).map((galleryImage, index) => (

                        <a key={galleryImage.title} href={galleryImage.url} data-fancybox="gallery" data-caption={galleryImage.title}>
                                <ImageListItem
                                    key={galleryImage.fileName}
                                    cols={1}
                                    rows={1}
                                    sx={{
                                        boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.3)', // Add box shadow
                                        borderRadius: '5px', // Add border radius for a cleaner look
                                        overflow: 'hidden', // Hide any overflowing content
                                        p: 1, 
                                        display: 'flex',
                                        justifyContent: 'center', // Center the image horizontally
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            position: 'relative', // Needed for absolute positioning
                                        }}
                                    >
                                        <img
                                            style={{
                                            width: '100%',
                                            height: 'auto',
                                            position: 'absolute', // Position the image absolutely within the container
                                            top: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)', // Center the image horizontally
                                            objectFit: 'cover',
                                            }}
                                            src={galleryImage.url}
                                            alt={galleryImage.fileName}
                                            loading="lazy"
                                        />
                                    </div> 
                                    
                                </ImageListItem>
                                <Typography variant="subtitle1" sx={{ mt: 2, textAlign: 'center', fontWeight: 'bold' }}>
                                        {galleryImage.title}
                                </Typography>  
                        </a>   
                        ))}
                    </ImageList>
                </Box>
                
                {/* BUTTON STACK */}
                <Stack direction="row" spacing={2} sx={{m: 3, justifyContent: "center"}}>
                {project.githubUrl && (
                    <Button variant="outlined" startIcon={<GitHubIcon />} target="_blank" href={project.githubUrl}> 
                    View Github
                    </Button>
                )}
                {project.liveUrl && (
                    <Button variant="outlined" startIcon={<PublicIcon />} target="_blank" href={project.liveUrl}>
                    View Live
                    </Button>
                )}
                    <Button 
                        variant="outlined" 
                        startIcon={<PhotoLibraryIcon />}
                        onClick={() => {
                            const galleryItems = galleryImages.map((image) => ({
                            src: image.url,
                            opts: {
                                caption: image.title,
                            },
                            }));

                            const fancybox = new Fancybox(galleryItems, {
                                loop: true,
                            });
                        }}
                    >
                        View All {numPhotos} Images
                    </Button>
                </Stack>

                <Divider/>

                {/* SKILLS USED */}
                <Box
                sx={{
                    p: { xs: 1, sm: 1, md: 2, lg: 3, xl: 3 } 
                }}
                >
                    <Typography 
                    variant="h4" 
                    align="left"
                    sx={{
                        p: 1,
                        mb: 2,
                        fontWeight: 'bold'
                    }}
                    >
                        Skills Used: 
                    </Typography>

                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap', 
                        justifyContent: 'flex-start', 
                        gap: '10px'
                    }}
                    >
                        {project.relatedSkillsCollection.items.map((skill, index) => (
                            <Box
                            key={index} 
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center', 
                                '& > :not(style)': {
                                m: 1,
                                width: 128,
                                height: 128,
                                },
                            }}
                            >
                            <Link 
                                href={`/skill/${skill.slug}`}
                                className={styles.skillLink}
                                underline="none"
                                style={{
                                backgroundImage: `url(${skill.image.url})`,
                                }}
                            > 
                                <Typography 
                                h3="true"
                                align="center"
                                className={styles.hoverableShow}
                                >
                                {skill.name}
                                </Typography>   
                            </Link>
                            
                            </Box>
                        ))}
                    </Box> 

                </Box>

                <Divider/>  
                
                {/* PROJECT DESCRIPTION */}
                <Box
                sx={{
                    p: { xs: 1, sm: 1, md: 2, lg: 3, xl: 3 } 
                }}
                > 
                    <>
                        {documentToReactComponents(
                            project.description.json
                        )}
                    </>    
                </Box> 

                <Divider/> 
                
                {/* RELATED EXPERIENCE */}
                <Box
                sx={{
                    p: { xs: 1, sm: 1, md: 2, lg: 3, xl: 3 } 
                }}
                >
                    <Typography 
                    variant="h4" 
                    align="left"
                    sx={{
                        p: 1,
                        mb: 2,
                        fontWeight: 'bold'
                    }}
                    >
                        Related Experience: 
                    </Typography>

                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap', 
                        justifyContent: 'flex-start', 
                        gap: '10px'
                    }}
                    >
                        <Box
                        key={relatedExperience.name} 
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center', 
                            '& > :not(style)': {
                            m: 1,
                            width: 128,
                            height: 128,
                            },
                        }}
                        >
                        <Link 
                            href={`/experience/${relatedExperience.slug}`}
                            className={styles.skillLink}
                            underline="none"
                            style={{
                            backgroundImage: `url(${relatedExperience.image.url})`,
                            }}
                        > 
                            <Typography 
                            h3="true"
                            align="center"
                            className={styles.hoverableShow}
                            >
                            {relatedExperience.name}
                            </Typography>   
                        </Link>
                        
                        </Box>
                    </Box> 

                </Box> 

            </Box>
        </Box>
      </>
    ) 
  }