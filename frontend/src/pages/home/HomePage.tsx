import { LinkOutlined, LineChartOutlined } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import { ShortenUrlForm } from "../../features/shorten-url/ui/ShortenUrlForm";
import { StatsForm } from "../../features/stats/ui/StatsForm";
import styles from "./HomePage.module.scss";

export function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.logo}>
          <LinkOutlined />
        </div>
        <Typography.Text className={styles.eyebrow}>
          SIMPLE. FAST. TRACKABLE.
        </Typography.Text>
        <Typography.Title className={styles.title}>
          Ссылки короче.
          <br />
          <span>Результаты яснее.</span>
        </Typography.Title>
        <Typography.Paragraph className={styles.subtitle}>
          Создавайте короткие ссылки и отслеживайте переходы
          <br className={styles.desktopBreak} />в одном аккуратном интерфейсе.
        </Typography.Paragraph>
      </section>
      <Row gutter={[24, 24]} className={styles.cards}>
        <Col xs={24} lg={13}>
          <ShortenUrlForm />
        </Col>
        <Col xs={24} lg={11}>
          <StatsForm />
        </Col>
      </Row>
      <footer className={styles.footer}>
        <LineChartOutlined /> Базовая аналитика для ваших ссылок
      </footer>
    </main>
  );
}
