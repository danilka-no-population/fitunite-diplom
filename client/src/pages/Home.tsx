import React, { useContext } from 'react';
import styled from 'styled-components';
import ScrollReveal from '../components/ScrollReveal';
import { Button } from '../components/Header/styled';
import { Link } from 'react-router-dom';
import { AuthContext } from '../authContext';

const Container = styled.div`
    max-width: 100vw;
    margin: 0 auto;
    padding: 0 0;
    overflow: hidden;
`;

const HeroSection = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 85vh;
    text-align: center;
    padding: 80px 0;
    position: relative;
    color: #F5F5F5;
    clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
    margin-bottom: -50px;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), 
                url('/src/assets/pexels-ketut-subiyanto-5039659.jpg') center/cover no-repeat;

    @media (max-width: 768px) {
        min-height: 80vh;
        padding: 60px 0;
    }
`;

const HeroTitle = styled.h1`
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    padding: 0 20px;

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }

    @media (max-width: 480px) {
        font-size: 2rem;
    }
`;

const HeroSubtitle = styled.p`
    font-size: 1.5rem;
    max-width: 800px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
    opacity: 0.9;
    padding: 0 20px;

    @media (max-width: 768px) {
        font-size: 1.2rem;
    }

    @media (max-width: 480px) {
        font-size: 1rem;
    }
`;

const CTAButtons = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 40px;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 15px;
    }
`;

const PrimaryButton = styled(Button)`
    background-color: #F5F5F5;
    color: #058E3A;
    padding: 15px 30px;
    font-size: 1.1rem;
    border: none;
    transition: all 0.3s ease;

    &:hover {
        background-color: #05396B;
        color: #F5F5F5;
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 480px) {
        padding: 10px 20px;
    }
`;

const SecondaryButton = styled(Button)`
    background-color: transparent;
    border: 2px solid #F5F5F5;
    padding: 15px 30px;
    font-size: 1.1rem;
    transition: all 0.3s ease;

    &:hover {
        background-color: #F5F5F5;
        color: #058E3A;
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 480px) {
        padding: 10px 20px;
    }
`;

const FeaturesSection = styled.section`
    padding: 100px 0;
    background-color: #EDF5E0;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
        padding: 60px 0;
    }
`;

const SectionTitle = styled.h2`
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 70px;
    color: #05396B;
    padding: 0 20px;

    @media (max-width: 768px) {
        font-size: 2rem;
        margin-bottom: 50px;
    }
`;

const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* по умолчанию — 4 карточки */
    gap: 30px;
    padding: 0 20px;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr); /* на планшетах — по 2 */
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr; /* на мобилках — по 1 */
    }
`;


const FeatureCard = styled.div`
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    text-align: center;
    height: 100%; /* растягиваем на всю доступную высоту */
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    }
`;


const FeatureIcon = styled.img`
    width: 80px;
    height: 80px;
    margin: 0 auto 25px;
    object-fit: contain;
`;


const FeatureTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #05396B;
`;

const FeatureDescription = styled.p`
    color: #666;
    line-height: 1.6;
`;

const StatsSection = styled.section`
    padding: 80px 0;
    background-color: #05396B;
    color: #F5F5F5;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    text-align: center;

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const StatItem = styled.div`
    padding: 20px;
`;

const StatNumber = styled.div`
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #5CDB94;

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`;

const StatLabel = styled.div`
    font-size: 1.2rem;
    opacity: 0.9;
`;

const TestimonialsSection = styled.section`
    padding: 100px 0;
    background-color: #EDF5E0;

    @media (max-width: 768px) {
        padding: 60px 0;
    }
`;

const TestimonialsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 в ряд */
    gap: 30px;
    padding: 0 20px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr; /* сразу 1 в ряд, чтобы не было 2+1 */
    }
`;


const TestimonialCard = styled.div`
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;


const TestimonialText = styled.p`
    font-style: italic;
    margin-bottom: 20px;
    color: #333;
    line-height: 1.6;
`;

const TestimonialAuthor = styled.div`
    display: flex;
    align-items: center;
`;

const AuthorAvatar = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #058E3A;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
    font-weight: bold;
    color: #05396B;
`;

const AuthorRole = styled.div`
    font-size: 0.9rem;
    color: #666;
`;

const FinalCTASection = styled.section`
    padding: 100px 0;
    text-align: center;
    background: linear-gradient(135deg, #5CDB94 0%, #058E3A 100%);
    color: #F5F5F5;
    clip-path: polygon(0 10%, 100% 0, 100% 100%, 0 100%);
    margin-top: -50px;

    @media (max-width: 768px) {
        padding: 80px 0;
    }
`;

const FinalCTATitle = styled.h2`
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    padding: 0 20px;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const FinalCTASubtitle = styled.p`
    font-size: 1.2rem;
    max-width: 700px;
    margin: 0 auto 2.5rem;
    opacity: 0.9;
    line-height: 1.6;
    padding: 0 20px;
`;

const InfoSection = styled.section`
    padding: 60px 0 100px 0;
    text-align: center;
    background: #05396B;
    color: #F5F5F5;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 100%);
    margin-bottom: -50px;

    @media (max-width: 768px) {
        padding: 60px 0 100px 0;
    }
`;

const InfoTitle = styled.h2`
    font-size: 2.5rem;
    margin-bottom: 1rem;
    padding: 0 35px;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const InfoText = styled.p`
    font-size: 1.2rem;
    max-width: 700px;
    padding: 0 40px;
    margin: 0 auto;
    line-height: 1.6;
    opacity: 0.9;
`;

const MarqueeSection = styled.section`
  background: linear-gradient(135deg, #05396B 0%, #032B50 100%);
  background: #EDF5E0;
  color: #05396B;
  padding: 40px 0;
  overflow: hidden;
  clip-path: polygon(0 40%, 100% 0%, 100% 60%, 0% 100%);
  position: relative;
  z-index: 2;
`;

const MarqueeWrapper = styled.div`
  transform: rotate(-1.8deg);
  overflow: hidden;
  white-space: nowrap;
  display: flex;

  @media (min-width: 2000px) {
    transform: rotate(-1deg);
    }

    @media (max-width: 1500px) {
    transform: rotate(-2deg);
    }

  @media (max-width: 1250px) {
    transform: rotate(-2.5deg);
    }

    @media (max-width: 1024px) {
    transform: rotate(-3deg);
    }

    @media (max-width: 800px) {
    transform: rotate(-3.5deg);
    }

    @media (max-width: 650px) {
    transform: rotate(-4deg);
    }

    @media (max-width: 550px) {
    transform: rotate(-4.5deg);
    }

    @media (max-width: 480px) {
    transform: rotate(-5deg);
    }

    @media (max-width: 420px) {
    transform: rotate(-5.5deg);
    }

    @media (max-width: 380px) {
    transform: rotate(-6.5deg);
    }

    @media (max-width: 350px) {
    transform: rotate(-8deg);
    }

    @media (max-width: 320px) {
    transform: rotate(-9deg);
    }

    @media (max-width: 300px) {
    transform: rotate(-10deg);
    }
`;

const MarqueeTrack = styled.div`
  display: flex;
  animation: scrollDiagonal 50s linear infinite;

  @keyframes scrollDiagonal {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

const MarqueeText = styled.span`
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0;
  text-transform: uppercase;
  padding-right: 4rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    letter-spacing: 2px;
    padding-right: 2rem;
  }
`;




const Home: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);

    const featureIcons = [
        '/src/assets/weightlift_3094772.png',
        '/src/assets/apple_8324598.png',
        '/src/assets/rising_1141830.png',
        '/src/assets/courier_6160192.png'
    ];
    
    const featureTitles = [
        'Программы тренировок',
        'Дневник питания',
        'Прогресс тренировок',
        'Общение с тренером'
    ];
    
    const featureDescriptions = [
        'Вы сможете найти множество программ тренировок, соответствующие вашим целям',
        'Ведение дневника питания позволит отслеживать БЖУ и калории, которые вы потребялете',
        'Наглядная статистика и аналитика ваших результатов для мотивации и внесения корректировок',
        'Профессиональные тренеры всегда готовы помочь советом и скорректировать вашу программу'
    ];    

    return (
        <Container>
            {/* Герой секция */}
            <HeroSection>
                <ScrollReveal delay={0.1}>
                    <HeroTitle>Добро пожаловать в FitUnite!</HeroTitle>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                    <HeroSubtitle>
                        Здесь вы сможете найти всё, что нужно для занятий спортом и фитнесом - программы тренировок, дневник питания и тренировок, графики прогресса тренировок, а также взаимодействие с вашим тренером!
                    </HeroSubtitle>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                    <CTAButtons>
                        {isAuthenticated ? (
                            <PrimaryButton as={Link} to="/profile">Мой профиль</PrimaryButton>
                        ) : (
                            <>
                                <PrimaryButton as={Link} to="/register">Зарегистрироваться</PrimaryButton>
                                <SecondaryButton as={Link} to="/login">Войти</SecondaryButton>
                            </>
                        )}
                    </CTAButtons>
                </ScrollReveal>
            </HeroSection>

            {/* Секция преимуществ */}
            <FeaturesSection>
                <ScrollReveal>
                    <SectionTitle>Почему выбирают FitUnite?</SectionTitle>
                </ScrollReveal>
                <FeaturesGrid>
                    {featureTitles.map((title, i) => (
                        <ScrollReveal key={i} delay={0.1 + i * 0.1}>
                            <FeatureCard>
                                <FeatureIcon src={featureIcons[i]} alt={title} />
                                <FeatureTitle>{title}</FeatureTitle>
                                <FeatureDescription>{featureDescriptions[i]}</FeatureDescription>
                            </FeatureCard>
                        </ScrollReveal>
                    ))}
                </FeaturesGrid>
            </FeaturesSection>

            {/* Секция статистики */}
            <StatsSection>
                <ScrollReveal>
                    <StatsGrid>
                        {['100+', '15+', '90+', '24/7'].map((stat, i) => (
                            <StatItem key={i}>
                                <StatNumber>{stat}</StatNumber>
                                <StatLabel>
                                    {[
                                        'Довольных клиентов', 
                                        'Программ тренировок', 
                                        'Тренировочных упражнений', 
                                        'Поддержка'
                                    ][i]}
                                </StatLabel>
                            </StatItem>
                        ))}
                    </StatsGrid>
                </ScrollReveal>
            </StatsSection>

            {/* Секция отзывов */}
            <TestimonialsSection>
                <ScrollReveal>
                    <SectionTitle>Отзывы пользователей</SectionTitle>
                </ScrollReveal>
                <TestimonialsGrid>
                    {[...Array(3)].map((_, i) => (
                        <ScrollReveal key={i} delay={0.1 + i * 0.1}>
                            <TestimonialCard>
                                <TestimonialText>
                                    {[
                                        `"Благодаря FitUnite я похудел на 15 кг за 3 месяца! Тренер подобрал идеальную программу, 
                                        а дневник питания помог следить за тем, что я ем."`,
                                        `"Как персональный тренер, я ценю удобство работы с клиентами через FitUnite. Все данные под рукой, 
                                        легко отслеживать прогресс моих клиентов и держать с ними связь."`,
                                        `"После рождения ребенка никак не могла прийти в форму. FitUnite и мой тренер помог мне подобрать 
                                        щадящие тренировки и сбалансированное питание. Результат - минус 8 кг за 2 месяца!"`
                                    ][i]}
                                </TestimonialText>
                                <TestimonialAuthor>
                                    <AuthorAvatar>{['ДЯ', 'ДБ', 'ЕП'][i]}</AuthorAvatar>
                                    <AuthorInfo>
                                        <AuthorName>
                                            {['Даниил Язвинский', 'Дмитрий Барабанов', 'Екатерина Проектова'][i]}
                                        </AuthorName>
                                        <AuthorRole>
                                            {['Клиент, 22 года', 'Персональный тренер', 'Клиент, 35 лет'][i]}
                                        </AuthorRole>
                                    </AuthorInfo>
                                </TestimonialAuthor>
                            </TestimonialCard>
                        </ScrollReveal>
                    ))}
                </TestimonialsGrid>
            </TestimonialsSection>

            <InfoSection>
                {/* <ScrollReveal delay={0.1}>
                    <InfoIcon>😢</InfoIcon>
                </ScrollReveal> */}
                <ScrollReveal delay={0.2}>
                    <InfoTitle>А что если у меня нет тренера?😢</InfoTitle>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                    <InfoText>
                        Ничего! Вы можете сами добавлять выполненные тренировки и тем самым вести дневник тренировок, 
                        добавлять питание по дням и вести дневник питания, а также видеть свой прогресс!
                    </InfoText>
                </ScrollReveal>
            </InfoSection>

            <MarqueeSection>
                <MarqueeWrapper>
                    <MarqueeTrack>
                    {Array(20).fill('ИДИ К СВОЕЙ ЦЕЛИ!').map((text, index) => (
                        <MarqueeText key={`first-${index}`}>{text}🥇</MarqueeText>
                    ))}
                    {Array(20).fill('ИДИ К СВОЕЙ ЦЕЛИ!').map((text, index) => (
                        <MarqueeText key={`second-${index}`}>{text}🥇</MarqueeText>
                    ))}
                    </MarqueeTrack>
                </MarqueeWrapper>
            </MarqueeSection>

            {/* Финальный CTA */}
            <FinalCTASection>
                <ScrollReveal delay={0.1}>
                    <FinalCTATitle>Готовы к выполнению тренировок?</FinalCTATitle>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                    <FinalCTASubtitle>
                        Просмотрите программы тренировок и подберите какую-нибудь для себя! А если вы тренер, то вы также сможете создать свою программу тренировок!
                    </FinalCTASubtitle>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                    {isAuthenticated ? (
                        <PrimaryButton as={Link} to="/programs">Найти программу тренировок</PrimaryButton>
                    ) : (
                        <PrimaryButton as={Link} to="/register">Зарегистрироваться</PrimaryButton>
                    )}
                </ScrollReveal>
            </FinalCTASection>
        </Container>
    );
};

export default Home;