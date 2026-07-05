import PieDonutChart, { type DataItem } from '@garvae/react-pie-donut-chart';
import {
  Anchor,
  Badge,
  Box,
  Button,
  Code,
  Container,
  Divider,
  Group,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import {
  IconAccessible,
  IconBrandGithub,
  IconCircleCheck,
  IconCode,
  IconMoonStars,
  IconPackage,
  IconPlayerPlay,
  IconRocket
} from '@tabler/icons-react';
import { type ReactNode, useRef, useState } from 'react';

type PropRow = {
  defaultValue: string;
  description: string;
  name: string;
  type: string;
};

const heroData: DataItem[] = [
  { color: '#22d3ee', id: 'design', value: 35 },
  { color: '#0f172a', id: 'runtime', value: 25 },
  { color: '#f97316', id: 'a11y', value: 20 },
  { color: '#14b8a6', id: 'api', value: 20 }
];

const revenueData: DataItem[] = [
  { color: '#0ea5e9', id: 'North America', value: 42 },
  { color: '#f97316', id: 'Europe', value: 28 },
  { color: '#22c55e', id: 'Asia', value: 18 },
  { color: '#a855f7', id: 'Other', value: 12 }
];

const trafficData: DataItem[] = [
  { color: '#06b6d4', id: 'Organic', value: 48 },
  { color: '#f59e0b', id: 'Paid', value: 19 },
  { color: '#10b981', id: 'Referral', value: 21 },
  { color: '#8b5cf6', id: 'Direct', value: 12 }
];

const stackData: DataItem[] = [
  { color: '#0891b2', id: 'React', value: 38 },
  { color: '#2563eb', id: 'TypeScript', value: 27 },
  { color: '#eab308', id: 'Vite', value: 19 },
  { color: '#111827', id: 'Jest', value: 16 }
];

const installCommands = ['pnpm run demo:install', 'pnpm run demo:dev', 'pnpm run build:watch'];

const propRows: PropRow[] = [
  {
    defaultValue: '—',
    description: 'Required array of chart segments.',
    name: 'data',
    type: 'DataItem[]'
  },
  {
    defaultValue: '—',
    description: 'Fixed chart size in pixels. Use instead of parentRef.',
    name: 'size',
    type: 'number'
  },
  {
    defaultValue: '—',
    description: 'Responsive mode: chart reads dimensions from the parent element.',
    name: 'parentRef',
    type: 'RefObject<HTMLElement>'
  },
  {
    defaultValue: '—',
    description: 'Turns the chart into a donut by defining the ring thickness.',
    name: 'donutThickness',
    type: 'number'
  },
  {
    defaultValue: '—',
    description: 'Gap between segments in pixels.',
    name: 'gap',
    type: 'number'
  },
  {
    defaultValue: '"Pie donut chart"',
    description: 'Accessible label for the root SVG.',
    name: 'ariaLabel',
    type: 'string'
  },
  {
    defaultValue: 'auto',
    description: 'Custom accessible label factory for each segment.',
    name: 'getSegmentAriaLabel',
    type: '(segment, index) => string'
  },
  {
    defaultValue: 'true',
    description: 'Enables click-to-select behavior.',
    name: 'isSelectOnClick',
    type: 'boolean'
  },
  {
    defaultValue: '50',
    description: 'Debounce window for responsive resize re-renders.',
    name: 'resizeReRenderDebounceTime',
    type: 'number'
  },
  {
    defaultValue: '—',
    description: 'Controlled selected segment id.',
    name: 'selected',
    type: 'string'
  }
];

function ExampleCard({ children, description, title }: { children: ReactNode; description: string; title: string }) {
  return (
    <Paper className="demo-card" p="xl" radius="2rem" shadow="sm">
      <Stack gap="lg">
        <div>
          <Text className="eyebrow">Usage pattern</Text>
          <Title order={3}>{title}</Title>
          <Text c="dimmed" mt="xs">
            {description}
          </Text>
        </div>
        {children}
      </Stack>
    </Paper>
  );
}

function ResponsiveExample() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="responsive-frame">
      <PieDonutChart
        ariaLabel="Responsive usage demo"
        colors={{ chartCenter: '#f8fafc', segmentsBackground: '#e2e8f0' }}
        data={trafficData}
        donutThickness={32}
        gap={6}
        maxSize={320}
        minSize={180}
        parentRef={ref}
        text="Auto"
      />
    </div>
  );
}

function App() {
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>('North America');

  const selectedRegionValue = revenueData.find((segment) => segment.id === selectedRegion)?.value ?? 0;

  return (
    <Box className="app-shell">
      <div className="orb orb-left" />
      <div className="orb orb-right" />

      <Container size={1180} py={48}>
        <Stack gap={48}>
          <Paper className="hero-panel" p="xl" radius="2rem" shadow="md">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <Stack gap="lg">
                <Group gap="sm">
                  <Badge color="cyan" size="lg" variant="light">
                    Local package consumer
                  </Badge>
                  <Badge color="orange" size="lg" variant="light">
                    GitHub Pages ready
                  </Badge>
                  <Badge color="dark" size="lg" variant="light">
                    Auto dark mode
                  </Badge>
                </Group>

                <Stack gap="md">
                  <Title className="hero-title" order={1}>
                    React pie and donut charts with a real in-repo demo loop.
                  </Title>
                  <Text className="hero-copy">
                    This demo installs the local build from <Code>dist/</Code>, so the page behaves like a real consumer
                    app before any publish happens. The same build can also be deployed to GitHub Pages.
                  </Text>
                </Stack>

                <Group gap="sm">
                  <Button
                    component="a"
                    href="https://github.com/garvae/react-pie-donut-chart"
                    leftSection={<IconBrandGithub size={16} />}
                    radius="xl"
                    target="_blank">
                    Repository
                  </Button>
                  <Button
                    color="dark"
                    component="a"
                    href="https://github.com/garvae/react-pie-donut-chart/blob/main/docs/release-checklist.md"
                    leftSection={<IconRocket size={16} />}
                    radius="xl"
                    target="_blank"
                    variant="light">
                    Release guide
                  </Button>
                </Group>

                <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="md">
                  <Paper className="metric-card" p="md" radius="xl">
                    <Text className="metric-label">Examples</Text>
                    <Title order={3}>4 live patterns</Title>
                  </Paper>
                  <Paper className="metric-card" p="md" radius="xl">
                    <Text className="metric-label">Theme</Text>
                    <Title order={3}>Light + dark</Title>
                  </Paper>
                  <Paper className="metric-card" p="md" radius="xl">
                    <Text className="metric-label">Package source</Text>
                    <Title order={3}>Local dist</Title>
                  </Paper>
                </SimpleGrid>
              </Stack>

              <Paper className="chart-spotlight" p="lg" radius="2rem">
                <Stack align="center" gap="md">
                  <PieDonutChart
                    ariaLabel="Hero package qualities chart"
                    colors={{
                      chartCenter: '#f8fafc',
                      segmentsBackground: 'rgba(148, 163, 184, 0.18)'
                    }}
                    data={heroData}
                    donutThickness={42}
                    gap={7}
                    size={320}>
                    <div className="chart-center">
                      <span className="chart-kicker">Ready for release</span>
                      <strong>Trusted</strong>
                      <span>OIDC publish</span>
                    </div>
                  </PieDonutChart>

                  <Text c="dimmed" ta="center">
                    A single manual dispatch can later create the release PR, publish to npm, create the GitHub Release,
                    and keep the demo site synchronized from <Code>main</Code>.
                  </Text>
                </Stack>
              </Paper>
            </SimpleGrid>
          </Paper>

          <section>
            <Group justify="space-between" mb="lg">
              <div>
                <Text className="eyebrow">Live showcase</Text>
                <Title order={2}>Usage variants</Title>
              </div>
              <Group gap="xs">
                <Badge leftSection={<IconPlayerPlay size={14} />} variant="dot">
                  Clickable examples
                </Badge>
                <Badge leftSection={<IconMoonStars size={14} />} variant="dot">
                  Theme-aware UI
                </Badge>
              </Group>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <ExampleCard
                description="Simple fixed-size donut with center content for KPI surfaces."
                title="KPI donut">
                <Group align="center" justify="space-between" wrap="nowrap">
                  <PieDonutChart
                    ariaLabel="Traffic split chart"
                    colors={{
                      chartCenter: '#ffffff',
                      segmentsBackground: '#e2e8f0'
                    }}
                    data={trafficData}
                    donutThickness={36}
                    gap={6}
                    size={240}>
                    <div className="chart-center">
                      <span className="chart-kicker">Traffic mix</span>
                      <strong>48%</strong>
                      <span>Organic</span>
                    </div>
                  </PieDonutChart>

                  <Stack gap="xs" maw={220}>
                    <Text fw={600}>Why this matters</Text>
                    <Text c="dimmed" size="sm">
                      This is the smallest setup you would typically ship to a dashboard or marketing summary card.
                    </Text>
                  </Stack>
                </Group>
              </ExampleCard>

              <ExampleCard
                description="Controlled selection lets host apps sync chart state with filters, legends, or analytics panels."
                title="Controlled segment selection">
                <Stack gap="md">
                  <Group gap="xs">
                    {revenueData.map((segment) => (
                      <Button
                        key={segment.id}
                        color="dark"
                        onClick={() =>
                          setSelectedRegion((current) => (current === segment.id ? undefined : segment.id))
                        }
                        radius="xl"
                        size="sm"
                        variant={selectedRegion === segment.id ? 'filled' : 'light'}>
                        {segment.id}
                      </Button>
                    ))}
                  </Group>

                  <Group align="center" justify="space-between" wrap="nowrap">
                    <PieDonutChart
                      ariaLabel="Revenue split chart"
                      colors={{
                        chartCenter: '#fff7ed',
                        segmentsBackground: '#ffedd5'
                      }}
                      data={revenueData}
                      donutThickness={38}
                      gap={5}
                      onSegmentClick={(segmentId) => setSelectedRegion(segmentId)}
                      selected={selectedRegion}
                      size={240}
                      stylesHoveredSegment={{ filter: 'brightness(1.08)' }}
                    />

                    <Stack gap={2} maw={220}>
                      <Text fw={600}>{selectedRegion ?? 'No segment selected'}</Text>
                      <Text c="dimmed" size="sm">
                        {selectedRegion
                          ? `${selectedRegionValue}% of revenue`
                          : 'Use the legend buttons or chart clicks to inspect a slice.'}
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </ExampleCard>

              <ExampleCard
                description="Responsive charts can track the parent container without custom layout code in the consuming app."
                title="Responsive parentRef mode">
                <ResponsiveExample />
              </ExampleCard>

              <ExampleCard
                description="Accessible labels and styling hooks make the chart fit docs pages, design systems, and product dashboards."
                title="Docs-friendly pie variant">
                <Group align="center" justify="space-between" wrap="nowrap">
                  <PieDonutChart
                    ariaLabel="Technology stack chart"
                    className="docs-chart"
                    colors={{
                      chartBackground: '#ecfeff',
                      segmentFocusedOutline: '#0f172a'
                    }}
                    data={stackData}
                    getSegmentAriaLabel={(segment, index) =>
                      `${segment.id ?? `Segment ${index + 1}`}: ${segment.value}%`
                    }
                    gap={4}
                    size={240}
                    text="Stack"
                  />
                  <List
                    c="dimmed"
                    icon={
                      <ThemeIcon color="teal" radius="xl" size={22}>
                        <IconCircleCheck size={14} />
                      </ThemeIcon>
                    }
                    spacing="sm"
                    size="sm">
                    <List.Item>Distinct SVG aria label</List.Item>
                    <List.Item>Keyboard-focusable segments</List.Item>
                    <List.Item>Center text for contextual summaries</List.Item>
                  </List>
                </Group>
              </ExampleCard>
            </SimpleGrid>
          </section>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Paper className="demo-card" p="xl" radius="2rem" shadow="sm">
              <Stack gap="lg">
                <div>
                  <Text className="eyebrow">Operator notes</Text>
                  <Title order={2}>Local test loop</Title>
                </div>

                <Text c="dimmed">
                  The demo is intentionally wired to the built package output so you can verify the exact consumer
                  payload before release.
                </Text>

                <Stack gap="sm">
                  {installCommands.map((command) => (
                    <Code block className="command-block" key={command}>
                      {command}
                    </Code>
                  ))}
                </Stack>

                <Divider />

                <List
                  icon={
                    <ThemeIcon color="cyan" radius="xl" size={22}>
                      <IconPackage size={14} />
                    </ThemeIcon>
                  }
                  spacing="sm"
                  size="sm">
                  <List.Item>
                    <strong>Package build:</strong> <Code>pnpm run build</Code> refreshes <Code>dist/</Code>, including
                    the generated publish metadata.
                  </List.Item>
                  <List.Item>
                    <strong>Iterate fast:</strong> run <Code>pnpm run build:watch</Code> in a second terminal while Vite
                    serves the demo.
                  </List.Item>
                  <List.Item>
                    <strong>Release safe:</strong> the release workflow stays in dry-run mode unless you explicitly
                    switch it off.
                  </List.Item>
                </List>
              </Stack>
            </Paper>

            <Paper className="demo-card" p="xl" radius="2rem" shadow="sm">
              <Stack gap="lg">
                <div>
                  <Text className="eyebrow">Release behavior</Text>
                  <Title order={2}>What the manual release dispatch does</Title>
                </div>

                <List
                  icon={
                    <ThemeIcon color="orange" radius="xl" size={22}>
                      <IconRocket size={14} />
                    </ThemeIcon>
                  }
                  spacing="sm"
                  size="sm">
                  <List.Item>Calculates the next version from workflow inputs.</List.Item>
                  <List.Item>
                    Runs <Code>check:all</Code>, <Code>audit</Code>, and version preflight.
                  </List.Item>
                  <List.Item>Uploads the exact npm tarball as a workflow artifact.</List.Item>
                  <List.Item>
                    On real runs, creates and merges the release PR, tags the merge commit, publishes to npm with
                    provenance, and creates the GitHub Release.
                  </List.Item>
                  <List.Item>
                    The merge back to <Code>main</Code> keeps the Pages demo in sync automatically.
                  </List.Item>
                </List>
              </Stack>
            </Paper>
          </SimpleGrid>

          <Paper className="demo-card" p="xl" radius="2rem" shadow="sm">
            <Stack gap="lg">
              <div>
                <Text className="eyebrow">Reference</Text>
                <Title order={2}>Key props</Title>
                <Text c="dimmed" mt="xs">
                  The README still contains the full API surface. This table highlights the props you will use most
                  often inside product code.
                </Text>
              </div>

              <div className="table-wrap">
                <Table striped highlightOnHover horizontalSpacing="lg">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Prop</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Default</Table.Th>
                      <Table.Th>Description</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {propRows.map((row) => (
                      <Table.Tr key={row.name}>
                        <Table.Td>
                          <Code>{row.name}</Code>
                        </Table.Td>
                        <Table.Td>{row.type}</Table.Td>
                        <Table.Td>{row.defaultValue}</Table.Td>
                        <Table.Td>{row.description}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Stack>
          </Paper>

          <Paper className="footer-panel" p="xl" radius="2rem" shadow="sm">
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
              <Stack gap="xs">
                <ThemeIcon color="cyan" radius="xl" size={42} variant="light">
                  <IconAccessible size={22} />
                </ThemeIcon>
                <Title order={3}>Accessible by default</Title>
                <Text c="dimmed" size="sm">
                  Root SVG labels, segment keyboard access, and custom segment aria labels are all part of the public
                  API.
                </Text>
              </Stack>

              <Stack gap="xs">
                <ThemeIcon color="orange" radius="xl" size={42} variant="light">
                  <IconCode size={22} />
                </ThemeIcon>
                <Title order={3}>Real consumer path</Title>
                <Text c="dimmed" size="sm">
                  The demo imports the published build shape, not the raw source, so local validation matches release
                  behavior much more closely.
                </Text>
              </Stack>

              <Stack gap="xs">
                <ThemeIcon color="dark" radius="xl" size={42} variant="light">
                  <IconBrandGithub size={22} />
                </ThemeIcon>
                <Title order={3}>Docs + release sync</Title>
                <Text c="dimmed" size="sm">
                  The Pages deployment and the release automation are both driven from <Code>main</Code>, which prevents
                  documentation drift after a real release.
                </Text>
              </Stack>
            </SimpleGrid>

            <Text c="dimmed" mt="xl" size="sm">
              Need the full installation and prop reference? See the main repo{' '}
              <Anchor href="https://github.com/garvae/react-pie-donut-chart" target="_blank">
                README
              </Anchor>
              .
            </Text>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
