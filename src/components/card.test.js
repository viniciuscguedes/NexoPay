import { render, screen } from '@testing-library/react';
import Card from './card';

test('exibe o título e o conteúdo do card', () => {
  render(
    <Card title='Empresas'>
      <p>conteúdo</p>
    </Card>
  );
  expect(screen.getByText('Empresas')).toBeInTheDocument();
  expect(screen.getByText('conteúdo')).toBeInTheDocument();
});
