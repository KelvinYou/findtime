import { Trans } from '@lingui/react';
import { User, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

export function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={ROUTES.PROFILE}>
          <User className="mr-2 h-4 w-4" />
          <Trans id="Profile" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.SETTINGS}>
          <Settings className="mr-2 h-4 w-4" />
          <Trans id="Settings" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <Trans id="Log out" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 