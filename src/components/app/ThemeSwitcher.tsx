import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/DropdownMenu';
import { type FC } from 'react';

const ThemeSwitcher: FC = () => {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu data-cy='theme-switcher'>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='responsive'>
          <Sun className='absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          data-cy='theme-light'
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} data-cy='theme-dark'>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          data-cy='theme-system'
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
