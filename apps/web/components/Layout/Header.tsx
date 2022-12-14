import { Popover } from '@headlessui/react';
import { useScroll } from 'ahooks';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { ToggleDarkBtn } from './ToggleDarkBtn';

const menus = [
  { name: '关于', path: '/about' },
  { name: '文章', path: '/articles' },
  { name: '标签', path: '/tags' },
  { name: '专栏', path: '/topics' },
  { name: '作品', path: '/projects' },
];

const Menus = () => {
  // const router = useRouter();

  return (
    <div className="flex basis-2/4 justify-end md:justify-center">
      <Popover className="pointer-events-auto md:hidden">
        <Popover.Button className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
          菜单
          <svg
            viewBox="0 0 8 6"
            aria-hidden
            className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400"
          >
            <path
              d="M1.75 1.75 4 4.25l2.25-2.5"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Popover.Button>
        <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80 opacity-100"></Popover.Overlay>

        <Popover.Panel className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800 opacity-100 scale-100">
          <div className="flex flex-row-reverse items-center justify-between">
            <Popover.Button
              aria-label="Close menu"
              type="button"
              className="-m-1 p-1"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="h-6 w-6 text-zinc-500 dark:text-zinc-400"
              >
                <path
                  d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </Popover.Button>

            <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              菜单
            </h2>
          </div>
          <nav className="mt-6">
            <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
              {menus.map(({ name, path }, i) => (
                <li key={i}>
                  <Link href={path} className="block py-2">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Popover.Panel>
      </Popover>

      <nav className="pointer-events-auto hidden md:block">
        <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
          {menus.map(({ name, path }, i) => (
            <li key={i}>
              <Link
                href={path}
                className={classNames(
                  'relative block px-3 py-2 transition',
                  // path === router.asPath
                  //   ? 'text-teal-500 dark:text-teal-400'
                  //   : 'hover:text-teal-500 dark:hover:text-teal-400',
                )}
              >
                {name}
                {/* {path === router.asPath && (
                    <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0"></span>
                  )} */}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export const Header = ({ isHome }: { isHome: boolean }) => {
  const scroll = useScroll(() => document);
  const top = scroll?.top || 0;
  const translateValue = useMemo(() => {
    if (top >= 116) return 0.125;
    if (top > 0) return (0.125 / 116) * top;
    return 0; // 0.125
  }, [top]);
  const scaleValue = useMemo(() => {
    if (top >= 116) return 0.5625;
    if (top > 0) return 1 - (0.4375 / 116) * top;
    return 1; // 1
  }, [top]);

  return (
    <header className="pointer-events-none relative z-50 flex flex-col">
      {isHome && (
        <>
          <div className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"></div>
          <div
            className={classNames(
              'sm:px-8 top-0 order-last -mb-3 pt-3',
              scaleValue <= 0.5625 && 'invisible',
            )}
          >
            <div className="mx-auto max-w-7xl lg:px-8">
              <div className="relative px-4 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-2xl lg:max-w-5xl">
                  <div className="top-[var(--avatar-top,theme(spacing.3))] w-full">
                    <div className="relative">
                      <Link
                        href="/"
                        aria-label="Home"
                        className="block h-16 w-16 origin-left pointer-events-auto"
                        style={{
                          transform: `translate3d(${translateValue}rem, 0, 0) scale(${scaleValue})`,
                        }}
                      >
                        <Image
                          className="rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 h-16 w-16"
                          sizes="4rem"
                          width={512}
                          height={512}
                          src="/media/avatar.jpg"
                          alt=""
                        ></Image>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="top-0 z-10 h-16 pt-6">
        <div className="sm:px-8 fixed top-6 w-full">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="relative px-4 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl lg:max-w-5xl">
                <div className="relative flex gap-4">
                  <div className="flex basis-1/4">
                    {(!isHome || scaleValue <= 0.5625) && (
                      <div className="h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10">
                        <Link
                          href="/"
                          aria-label="Home"
                          className="pointer-events-auto"
                        >
                          <Image
                            className="rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 h-9 w-9"
                            sizes="2.25rem"
                            width={512}
                            height={512}
                            src="/media/avatar.jpg"
                            alt=""
                          ></Image>
                        </Link>
                      </div>
                    )}
                  </div>
                  <Menus />
                  <div className="flex justify-end md:basis-1/4">
                    <div className="pointer-events-auto">
                      <ToggleDarkBtn />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
