import React from 'react'
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
    width:100vw;
    height:100vh;
    background-image: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url(${({ imagePath }) => imagePath});
    background-size: cover;
    background-position: center;
    animation: ${fadeIn} 0.8s ease-out forwards;
`
const Topbar = styled.div`
    width:100%;
    position:relative;
    height:4rem;
    display:flex;
    align-items:center;
    justify-content:center;
`
const Title = styled.h1`
    font-size:1.5rem;

    @media (max-width:600px) {
        position:absolute;
        left:2rem;
    }
`
const RegisterButton = styled.div`
    position:absolute;
    right:2rem;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color:rgb(100, 100, 100);
    }
`

const Body = styled.div`
    width:100%;
    height:calc(100vh - 4rem);
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`
const Heading = styled.h1`
    margin-bottom:2rem;
    font-size:5rem;

    @media (max-width:600px) {
        font-size:3.5rem;
    }

`
const Slogan = styled.h2`
    margin-bottom:2rem;
    font-weight:400;
    font-size:1.75rem;
`

const Description = styled.h3`
    margin-bottom:2rem;
    font-weight:400;
`

export default function LandingPage() {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER || "/images/";
    const imagePath = PUBLIC_FOLDER + "background/diary.jpg";
    const navigate = useNavigate();


    return (
        <>
            <Container imagePath={imagePath}>
                <Topbar>
                    <Title><FontAwesomeIcon icon={faPencil} /> Mini Diary</Title>
                    <RegisterButton onClick={()=> navigate("/register")}>サインアップ</RegisterButton>
                </Topbar>
                <Body>
                    <Heading>Mini Diary</Heading>
                    <Slogan>日々を記録し、自分を見つける喜びを</Slogan>
                    <Description>日記を書くことは、過去を振り返り未来を描く自由な旅です<br></br>MiniDiaryは、日々の小さな気づきや感情を記録し<br></br>あなた自身の成長に寄り充うパートナーです</Description>
                </Body>
            </Container>
        </>
    );
}
