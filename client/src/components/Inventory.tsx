import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemCard from "./ItemCard";
import PageHeader from "./PageHeader";
import EmptyState from "./EmptyState";
import type { Item } from "@shared/schema";
import { Package, Sword, Shield, Pill } from "lucide-react";

interface InventoryProps {
  items: Item[];
  onItemTap?: (item: Item) => void;
  onItemLongPress?: (item: Item) => void;
  className?: string;
}

export default function Inventory({ items, onItemTap, onItemLongPress, className = "" }: InventoryProps) {
  const weapons = items.filter(item => item.type === "weapon");
  const armor = items.filter(item => item.type === "armor");
  const consumables = items.filter(item => item.type === "consumable");
  const misc = items.filter(item => item.type === "misc");
  
  const allItems = items;

  return (
    <div className={`h-full ${className}`} data-testid="inventory">
      <Card className="h-full flex flex-col">
        <PageHeader
          title="Inventory"
          icon={Package}
          subtitle={`${items.length} items • Tap to use`}
        />

        <CardContent className="flex-1 overflow-hidden">
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 h-11">
              <TabsTrigger value="all" className="text-xs px-1 sm:px-2">
                <Package className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="weapons" className="text-xs px-1 sm:px-2">
                <Sword className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="armor" className="text-xs px-1 sm:px-2">
                <Shield className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="consumables" className="text-xs px-1 sm:px-2">
                <Pill className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="misc" className="text-xs px-1 sm:px-2">
                <Package className="w-3 h-3 sm:hidden" />
                <span className="hidden sm:inline">Misc</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 overflow-auto mt-3 sm:mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {allItems.length === 0 ? (
                  <div className="col-span-2 sm:col-span-3 md:col-span-4">
                    <EmptyState icon={Package} title="No items" />
                  </div>
                ) : (
                  allItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onTap={onItemTap}
                      onLongPress={onItemLongPress}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="weapons" className="flex-1 overflow-auto mt-3 sm:mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {weapons.length === 0 ? (
                  <div className="col-span-2 sm:col-span-3 md:col-span-4">
                    <EmptyState icon={Sword} title="No weapon items" />
                  </div>
                ) : (
                  weapons.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onTap={onItemTap}
                      onLongPress={onItemLongPress}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="armor" className="flex-1 overflow-auto mt-3 sm:mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {armor.length === 0 ? (
                  <div className="col-span-2 sm:col-span-3 md:col-span-4">
                    <EmptyState icon={Shield} title="No armor items" />
                  </div>
                ) : (
                  armor.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onTap={onItemTap}
                      onLongPress={onItemLongPress}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="consumables" className="flex-1 overflow-auto mt-3 sm:mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {consumables.length === 0 ? (
                  <div className="col-span-2 sm:col-span-3 md:col-span-4">
                    <EmptyState icon={Pill} title="No consumable items" />
                  </div>
                ) : (
                  consumables.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onTap={onItemTap}
                      onLongPress={onItemLongPress}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="misc" className="flex-1 overflow-auto mt-3 sm:mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {misc.length === 0 ? (
                  <div className="col-span-2 sm:col-span-3 md:col-span-4">
                    <EmptyState icon={Package} title="No misc items" />
                  </div>
                ) : (
                  misc.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onTap={onItemTap}
                      onLongPress={onItemLongPress}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}