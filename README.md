PublicAI homepage

## Getting Started

First, install all dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

## Docker Deploy

Build images:

```bash
docker build --platform linux/amd64 -t homepage-docker .
```

View current run images:

```bash
docker ps
```

Stop last run image:

```bash
docker container stop [IMAGE ID]
```

Run latest image:

```bash
docker run -p 3000:3000 homepage-docker
```

Remove last container:

```bash
docker container rm [IMAGE ID]
```
