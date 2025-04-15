"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, Shield, CreditCard, Bell, Key, Smartphone, Wallet } from "lucide-react"

interface SettingsNavProps {
  pathname: string
}

export default function SettingsNav({ pathname }: SettingsNavProps) {
  const navItems = [
    {
      title: "个人资料",
      href: "/settings/profile",
      icon: <User className="h-4 w-4 mr-2" />,
    },
    {
      title: "账户安全",
      href: "/settings/account",
      icon: <Shield className="h-4 w-4 mr-2" />,
    },
    {
      title: "支付与订阅",
      href: "/settings/billing",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
    {
      title: "通知设置",
      href: "/settings/notifications",
      icon: <Bell className="h-4 w-4 mr-2" />,
    },
    {
      title: "API密钥",
      href: "/settings/api-keys",
      icon: <Key className="h-4 w-4 mr-2" />,
    },
    {
      title: "设备管理",
      href: "/settings/devices",
      icon: <Smartphone className="h-4 w-4 mr-2" />,
    },
    {
      title: "钱包记录",
      href: "/settings/wallet",
      icon: <Wallet className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="p-2">
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-400 hover:text-gray-100 hover:bg-gray-800",
                  pathname === item.href && "bg-gray-800 text-gray-100",
                )}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </Card>
  )
}
