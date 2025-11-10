import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Scroll,
  Mountain,
  Crown,
  Sword,
  Map,
  Users,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  TreePine,
  Skull,
  Flame
} from "lucide-react";

interface AdventureTemplatesProps {
  onSelectTemplate: (template: AdventureTemplate) => void;
  onBack: () => void;
  className?: string;
}

export interface AdventureTemplate {
  id: string;
  name: string;
  description: string;
  setting: string;
  theme: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Epic";
  estimatedLength: string;
  initialScene: string;
  initialQuest: {
    title: string;
    description: string;
    priority: "high" | "normal" | "low";
    maxProgress: number;
  };
  worldFeatures: string[];
  icon: JSX.Element;
  introMessage: string; // Rich, descriptive intro message from DM
}

const adventureTemplates: AdventureTemplate[] = [
  {
    id: "fellowship-quest",
    name: "The Fellowship's Journey",
    description: "A classic tale of heroes banding together to destroy an ancient evil. Journey through Middle-earth inspired landscapes with rich lore and meaningful companions.",
    setting: "Middle-earth Inspired",
    theme: "Epic Fantasy",
    difficulty: "Medium",
    estimatedLength: "8-12 hours",
    initialScene: "The Prancing Pony Inn",
    initialQuest: {
      title: "The Ring Bearer's Task",
      description: "You've been entrusted with a mysterious ring that must be taken to the Elven council. Strange dark riders have been seen in the area, seeking something...",
      priority: "high",
      maxProgress: 5
    },
    worldFeatures: [
      "Hobbit-holes and peaceful villages",
      "Ancient elven kingdoms",
      "Treacherous mountain passes",
      "Dark forests with lurking dangers",
      "Majestic kingdoms of men"
    ],
    icon: <Crown className="w-6 h-6" />,
    introMessage: `The wooden sign of The Prancing Pony Inn creaks in the evening wind as you push open the heavy oak door. Warm firelight spills across worn floorboards, mingling with the scent of pipe smoke, roasted meat, and spilled ale. A weathered innkeeper nods from behind the bar while locals huddle in shadowy corners, their voices dropping to whispers as you enter. Outside, the quiet village of Bree settles into an uneasy night—windows shuttered early, doors barred against the darkness gathering in the east.

You carry a burden that grows heavier with each passing hour: a simple golden ring, yet one that seems to pulse with ancient power. A wizard entrusted it to you with urgent instructions—take it to Rivendell, where the Elven council awaits. But dark riders have been spotted on the roads, cloaked figures who ask questions about "a hobbit" and "something precious." The innkeeper mentioned seeing such riders just this morning, their horses black as midnight, their voices cold as winter's grave.

**What do you do?**
• Approach the innkeeper privately to ask about safe roads to Rivendell and learn what he knows about the dark riders
• Find a quiet corner table and observe the other patrons, listening for useful information or potential allies
• Rent a room for the night and plan your departure at first light, hoping to avoid unwanted attention
• Seek out the local ranger known to frequent this inn—they say he knows the wilderness better than anyone`
  },
  {
    id: "northern-ranger",
    name: "Rangers of the North",
    description: "Become a guardian of the wild frontier. Protect settlements from bandits, monsters, and ancient threats while exploring vast wilderness.",
    setting: "Northern Wilderness",
    theme: "Survival & Protection",
    difficulty: "Easy",
    estimatedLength: "4-6 hours",
    initialScene: "Ranger's Lodge",
    initialQuest: {
      title: "The Missing Patrol",
      description: "A ranger patrol hasn't returned from their route along the northern border. Investigate their last known location and ensure the safety of nearby settlements.",
      priority: "normal",
      maxProgress: 4
    },
    worldFeatures: [
      "Dense pine forests",
      "Mountain watchtowers",
      "Small frontier settlements",
      "Hidden bandit camps",
      "Ancient ruins with secrets"
    ],
    icon: <TreePine className="w-6 h-6" />,
    introMessage: `Snow crunches beneath your boots as you approach the Ranger's Lodge, a sturdy log structure nestled against towering pines at the forest's edge. Smoke rises from the stone chimney, and through frosted windows you see rangers gathered around maps and warming fires. The northern wilderness stretches endlessly before you—ancient forests where wolves howl and stranger things lurk in the shadows between trees. Beyond the treeline, jagged mountain peaks pierce gray clouds, their watchtowers barely visible as dark specks against white snow.

Captain Aldric greets you with a grim expression, his weathered face lined with concern. Three days ago, a patrol of four rangers set out on their routine border circuit—they should have returned yesterday. Their route takes them past three frontier settlements: Pinehaven, Stonebridge, and Wolfden. The captain spreads a map across the rough wooden table, marking their planned path with a calloused finger. Rumors speak of increased bandit activity, strange tracks in the snow, and settlers hearing unsettling sounds from the old ruins to the east.

**What do you do?**
• Study the patrol route on the map and gather supplies before heading out immediately to search for the missing rangers
• Interview other rangers in the lodge about recent threats, unusual sightings, or changes in the wilderness
• Visit the nearest settlement, Pinehaven, to ask if anyone saw the patrol pass through and learn about local concerns
• Examine the gear room and select specialized equipment for wilderness survival and tracking before departing`
  },
  {
    id: "dragon-age",
    name: "The Dragon's Shadow",
    description: "An ancient dragon has awakened, threatening the kingdom. Gather allies, uncover the dragon's weakness, and prepare for an epic confrontation.",
    setting: "Highland Kingdom",
    theme: "Dragon Slaying",
    difficulty: "Hard",
    estimatedLength: "10-15 hours",
    initialScene: "The Royal Court",
    initialQuest: {
      title: "The King's Summons",
      description: "The king has called for heroes to investigate reports of a massive dragon seen flying over the eastern mountains. Villages have gone silent.",
      priority: "high",
      maxProgress: 6
    },
    worldFeatures: [
      "Royal castles and courts",
      "Dragon-scarred wastelands",
      "Mystical libraries with dragon lore",
      "Underground dwarven cities",
      "Sky-high mountain peaks"
    ],
    icon: <Flame className="w-6 h-6" />,
    introMessage: `The Royal Court falls silent as you enter the grand throne room, your footsteps echoing across polished marble floors. Towering stained-glass windows cast colored light across assembled nobles, their faces etched with worry beneath jeweled crowns and silk finery. King Aldoran sits heavily upon his throne, aged beyond his years these past weeks, while his advisors whisper urgently among themselves. Beyond the castle walls, the capital city bustles with nervous energy—merchants packing wagons, families fleeing eastward, soldiers drilling in the courtyard below.

The reports came first as rumors, then as horrifying truth: a dragon, ancient and vast, has awakened in the eastern mountains. Entire villages lie in ash. Livestock vanishes overnight. Survivors speak of scales like midnight, wings that blot out the sun, and eyes that burn with cold intelligence. The king's own dragon-slayers rode out two weeks ago—none returned. Now His Majesty seeks heroes brave or foolish enough to face what armies could not. The court wizard suggests seeking the dragon's weakness in forgotten lore, while the marshal advocates gathering allies from neighboring kingdoms.

**What do you do?**
• Speak with the court wizard to research dragon lore in the royal libraries and learn about historical dragon slayings
• Meet with the marshal to discuss military strategy, gather elite warriors, and obtain the finest weapons available
• Seek an audience with the king privately to learn everything he knows about the dragon and any secret information
• Journey to the nearest affected village to investigate the destruction firsthand and interview survivors`
  },
  {
    id: "underdark-expedition",
    name: "Into the Underdark",
    description: "Venture into the dangerous underground realm. Navigate complex politics between dark elf houses, discover ancient secrets, and survive constant danger.",
    setting: "Underground Realm",
    theme: "Political Intrigue",
    difficulty: "Hard",
    estimatedLength: "12-16 hours",
    initialScene: "The Deep Markets",
    initialQuest: {
      title: "The Prisoner's Information",
      description: "A captured drow noble claims to have information about a planned surface raid. Navigate the treacherous politics to learn what you need.",
      priority: "high",
      maxProgress: 7
    },
    worldFeatures: [
      "Sprawling underground cities",
      "Fungal forests and strange ecology",
      "Dark elf noble houses",
      "Ancient aberrant temples",
      "Labyrinthine cave systems"
    ],
    icon: <Skull className="w-6 h-6" />,
    introMessage: `Bioluminescent fungi cast an eerie purple glow across the Deep Markets, their light reflecting off obsidian walls carved smooth by centuries of dark elf artisans. The air hangs thick with incense, exotic spices, and the underlying scent of danger. Merchants display wares both wondrous and terrible—weapons that gleam with deadly enchantments, potions that promise power at unknown cost, slaves chained and silent. Above, stalactites drip with condensation, each drop echoing through the vast cavern that houses this underground city. In the distance, the elegant spires of noble house compounds rise like frozen shadows.

You've descended into the Underdark seeking a captured drow noble who claims to possess critical intelligence about a planned surface raid. But nothing is simple in this realm of treachery and shifting alliances. Three great houses vie for dominance: House Velryn trades in information, House Zau'tar commands military might, and House Kilsek controls the markets and criminal networks. Each suspects the others of plotting. The prisoner languishes in House Velryn's dungeons, but extracting him—or even speaking with him—will require navigating byzantine politics where one wrong word could mean death, or worse.

**What do you do?**
• Approach House Velryn's compound diplomatically to request an audience and negotiate for access to the prisoner
• Gather information in the markets by listening to rumors, hiring a local guide, and learning about the current political situation
• Seek out the criminal underworld controlled by House Kilsek to explore alternative methods of reaching the prisoner
• Find a dark elf merchant willing to trade information about House Velryn's defenses and the prisoner's exact location`
  },
  {
    id: "seafaring-adventure",
    name: "Pirates of the Forgotten Sea",
    description: "Captain your own ship across dangerous waters. Hunt for legendary treasure while dealing with rival pirates, sea monsters, and supernatural storms.",
    setting: "Archipelago Waters",
    theme: "Nautical Adventure",
    difficulty: "Medium",
    estimatedLength: "6-10 hours",
    initialScene: "Port Blackwater",
    initialQuest: {
      title: "The Treasure Map",
      description: "You've acquired a map leading to the legendary treasure of Captain Redbeard. But you'll need a ship, crew, and supplies to survive the journey.",
      priority: "normal",
      maxProgress: 5
    },
    worldFeatures: [
      "Pirate havens and ports",
      "Mysterious tropical islands",
      "Dangerous sea monsters",
      "Hidden treasure caves",
      "Rival pirate fleets"
    ],
    icon: <Map className="w-6 h-6" />,
    introMessage: `Salt spray stings your face as you stride down the weathered docks of Port Blackwater, the most notorious pirate haven in the Forgotten Sea. Ramshackle buildings lean against each other like drunken sailors, their walls adorned with faded flags and wanted posters. The harbor churns with activity—crews loading supplies, merchants haggling over stolen goods, and ships of every size bobbing at anchor. The smell of tar, rum, and adventure fills the air. Above it all, seabirds circle and call, as if laughing at the chaos below.

In your possession is a treasure map, worn and stained but unmistakably genuine, leading to the legendary hoard of Captain Redbeard—rubies the size of fists, chests overflowing with gold doubloons, and artifacts of lost civilizations. But the journey requires a ship, a crew, and enough supplies to survive waters prowled by rival pirates, sea monsters, and storms that appear out of nowhere. The map shows three islands forming a triangle: Skull Cove, where Redbeard's flagship went down; Siren's Rest, home to dangerous inhabitants; and Dead Man's Reef, where the treasure supposedly lies buried.

**What do you do?**
• Visit the harbor master to find a ship for sale or hire, and inquire about experienced captains looking for work
• Recruit a crew at the Rusty Anchor tavern by buying rounds and seeking sailors with useful skills
• Purchase supplies from the black market—weapons, navigation tools, and provisions for a long voyage
• Seek out a local navigator or cartographer who knows the treacherous waters and can help interpret the map's clues`
  },
  {
    id: "wizard-academy",
    name: "The Arcane Academy",
    description: "Join a prestigious magical academy. Learn spells, uncover conspiracies, and face a dark threat that seeks to corrupt magical knowledge itself.",
    setting: "Magical Academy",
    theme: "Magical Discovery",
    difficulty: "Easy",
    estimatedLength: "5-8 hours",
    initialScene: "Academy Entrance Hall",
    initialQuest: {
      title: "The New Student's Trial",
      description: "As a new student at the Academy, you must complete the entrance trials. But strange magical disturbances suggest something darker is at work.",
      priority: "normal",
      maxProgress: 4
    },
    worldFeatures: [
      "Grand magical academy",
      "Enchanted libraries and laboratories",
      "Student dormitories and common areas",
      "Forbidden magical archives",
      "Hidden chambers with dark secrets"
    ],
    icon: <Sparkles className="w-6 h-6" />,
    introMessage: `Crystalline spires pierce the morning sky as you stand before the gates of the Arcane Academy, the most prestigious institution of magical learning in all the realms. Floating orbs of light drift between towers, magical gardens bloom with impossible flowers, and the air itself shimmers with barely-contained power. Students in colorful robes hurry past carrying armfuls of ancient tomes, their whispered conversations mixing incantations with gossip. Beyond the gates, the entrance hall beckons—its vaulted ceiling covered in constellations that move and shift, showing the paths of celestial bodies both real and mystical.

You've arrived for the entrance trials, a series of tests that will determine whether you possess the talent, discipline, and potential to join the Academy's ranks. Success means access to libraries filled with centuries of magical knowledge, mentorship from the realm's greatest wizards, and the chance to unlock powers you've only dreamed of. But strange occurrences shadow your arrival: the headmaster seems distracted and worried, whispers speak of magical disturbances in the forbidden archives, and two promising students vanished last week during late-night studies. Some say the Academy holds secrets darker than any spell in its curriculum.

**What do you do?**
• Report to the Admissions Hall immediately to begin the entrance trials and prove your magical aptitude
• Explore the Academy grounds to familiarize yourself with the campus, libraries, and practice halls before trials begin
• Approach a group of current students to ask about the trials, learn about Academy life, and hear their concerns
• Investigate the rumors about magical disturbances by visiting the library and researching recent unusual events`
  }
];

const difficultyColors = {
  "Easy": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Medium": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
  "Hard": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "Epic": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
};

export default function AdventureTemplates({
  onSelectTemplate,
  onBack,
  className = ""
}: AdventureTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<AdventureTemplate | null>(null);

  const handleSelectTemplate = (template: AdventureTemplate) => {
    setSelectedTemplate(template);
  };

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground p-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header - Compact */}
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl flex items-center justify-center gap-2 text-primary mb-2">
            <Scroll className="w-6 h-6" />
            Adventure Templates
          </h1>
          <p className="text-muted-foreground text-sm">
            Choose your adventure setting and begin your epic journey
          </p>
        </div>

        {/* Template Grid - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {adventureTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover-elevate ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-primary border-primary'
                  : ''
              }`}
              onClick={() => handleSelectTemplate(template)}
              data-testid={`template-${template.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-primary shrink-0">
                      {template.icon}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base font-serif truncate">
                        {template.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground truncate">
                        {template.setting}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`text-xs shrink-0 ${difficultyColors[template.difficulty]}`}
                    data-testid={`difficulty-${template.difficulty.toLowerCase()}`}
                  >
                    {template.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {template.description}
                </p>

                <div className="flex gap-4 text-xs">
                  <div className="flex-1">
                    <span className="text-muted-foreground">Theme: </span>
                    <span className="font-medium">{template.theme}</span>
                  </div>
                  <div className="shrink-0">
                    <span className="text-muted-foreground">{template.estimatedLength}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.worldFeatures.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {template.worldFeatures.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.worldFeatures.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Template Details - Compact */}
        {selectedTemplate && (
          <Card className="mb-20 border-primary bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {selectedTemplate.icon}
                {selectedTemplate.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1">Starting Quest</h4>
                <div className="p-3 rounded-md bg-background">
                  <p className="font-medium text-sm text-primary">{selectedTemplate.initialQuest.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedTemplate.initialQuest.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <h4 className="font-medium text-sm mb-1">Starting Location</h4>
                  <p className="text-muted-foreground">{selectedTemplate.initialScene}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Features</h4>
                  <p className="text-muted-foreground">{selectedTemplate.worldFeatures.length} unique locations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation - Sticky */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4">
          <div className="max-w-6xl mx-auto flex justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              data-testid="button-templates-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>

            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedTemplate}
              size="lg"
              data-testid="button-start-adventure"
            >
              Start Adventure
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}