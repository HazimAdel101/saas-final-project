import { services } from '@/lib/servicesData';

export async function generateStaticParams() {
  return services.map((service) => ({
    id: service.id
  }));
}

export default function ProductLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
