'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Calculator,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';


const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

const sampleMaterials = [
  { id: 1, name: 'Portland Cement', category: 'Concrete', unit: 'bag', price: 280 },
  { id: 2, name: 'Sand', category: 'Aggregates', unit: 'cu.m', price: 1200 },
  { id: 3, name: 'Gravel', category: 'Aggregates', unit: 'cu.m', price: 1450 },
  { id: 4, name: 'CHB 4 inch', category: 'Masonry', unit: 'pc', price: 18 },
  { id: 5, name: 'Tile Adhesive', category: 'Tile Works', unit: 'bag', price: 420 },
];

const sampleProjects = [
  { id: 1, name: 'Residential House Estimate', client: 'Sample Client', status: 'Draft', date: '2026-05-02' },
  { id: 2, name: 'Office Renovation', client: 'ABC Corp', status: 'For Review', date: '2026-05-01' },
];

type Page = 'dashboard' | 'projects' | 'materials' | 'estimate' | 'concrete';

function Card({
  children,
  className = '',
  onClick,
  onDragOver,
  onDrop,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`rounded-3xl bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
}) {
  const styles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border bg-white text-slate-900 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    onLogin();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Calculator size={26} />
          </div>
          <h1 className="text-2xl font-bold">Estimate Program</h1>
          <p className="mt-2 text-sm text-slate-500">
            Login to manage projects, materials, and estimates.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            className="w-full rounded-2xl bg-slate-900 px-4 py-4 font-medium text-white"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </Card>
    </main>
  );
}

function Sidebar({
  activePage,
  setActivePage,
  onLogout,
}: {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
}) {
  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects' as Page, label: 'Projects', icon: FolderOpen },
    { id: 'materials' as Page, label: 'Materials', icon: Package },
    { id: 'estimate' as Page, label: 'Estimate Builder', icon: Calculator },
    { id: 'concrete' as Page, label: 'Concrete Calculator', icon: Calculator },
  ];

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r bg-white p-5 md:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-3 text-white">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold">Estimate App</h1>
          <p className="text-sm text-slate-500">Web starter</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold">Logged in as</p>
        <p className="text-sm text-slate-500">admin@example.com</p>
        <div className="mt-3">
          <Button variant="outline" onClick={onLogout}>
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}

function Dashboard() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <p className="mt-2 text-slate-500">Overview of your estimating system.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ['Projects', '2'],
          ['Materials', '5'],
          ['Draft Estimates', '1'],
          ['For Review', '1'],
        ].map(([label, value]) => (
          <Card key={label} className="p-6">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Projects({ onSelectProject }: { onSelectProject: (project: any) => void }) {
  const [projects, setProjects] = useState<any[]>([]);

  async function loadProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('project_name', { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setProjects(data || []);
  }

  useEffect(() => {
    loadProjects();
  }, []);


async function deleteProject(project: any) {
  if (!confirm(`Delete "${project.project_name}"? This cannot be undone.`)) {
    return;
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', project.id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadProjects();
}


  async function createProject() {
    const name = prompt('Enter project name:');
    if (!name) return;

    const { error } = await supabase.from('projects').insert([
      {
        project_name: name,
        status: 'draft',
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    await loadProjects();
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Projects</h2>
          <p className="mt-2 text-slate-500">
            Create and manage estimate projects.
          </p>
        </div>

        <Button onClick={createProject}>
          <Plus size={16} className="mr-2" /> New Project
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        {projects.length === 0 && (
          <Card className="p-5">
            <p className="text-slate-500">No projects yet.</p>
          </Card>
        )}

        {projects.map((project) => (
          <Card
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="flex cursor-pointer items-center justify-between p-5 hover:bg-slate-50"
          >
            <div>
              <h3 className="text-lg font-semibold">
                {project.project_name}
              </h3>
              <p className="text-sm text-slate-500">Project</p>
            </div>

           <div className="flex items-center gap-3">
  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium">
    {project.status || 'draft'}
  </span>

  <button
    onClick={(e) => {
      e.stopPropagation();
      deleteProject(project);
    }}
    className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
  >
    Delete
  </button>
</div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Materials() {
  const [query, setQuery] = useState('');
  const [materials, setMaterials] = useState<any[]>([]);

  async function loadMaterials() {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setMaterials(data || []);
  }

  useEffect(() => {
    loadMaterials();
  }, []);

  const filtered = materials.filter((m) =>
    `${m.material_name || ''} ${m.unit || ''}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  async function addMaterial() {
    const name = prompt('Material name:');
    if (!name) return;

    const unit = prompt('Unit:', 'pc') || 'pc';
    const priceText = prompt('Price:', '0') || '0';
    const price = Number(priceText);

    const { error } = await supabase.from('materials').insert([
      {
        name,
        unit,
        default_price: price,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    await loadMaterials();
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Materials</h2>
          <p className="mt-2 text-slate-500">Materials now load from Supabase.</p>
        </div>

        <Button onClick={addMaterial}>
          <Plus size={16} className="mr-2" /> Add Material
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search materials..."
          className="w-full outline-none"
        />
      </div>

      <Card className="mt-4 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Material</th>
              <th className="p-4">Unit</th>
              <th className="p-4">Price</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td className="p-4 text-slate-500" colSpan={3}>
                  No materials yet.
                </td>
              </tr>
            )}

            {filtered.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-4 font-medium">{m.name}</td>
                <td className="p-4">{m.unit}</td>
                <td className="p-4">{currency.format(Number(m.default_price || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}



function EstimateBuilder({
  project,
  setActivePage,
  setSelectedProject,
}: {
  project: any;
  setActivePage: (page: Page) => void;
  setSelectedProject: (project: any) => void;
}) {
  const defaultSections = [
    { id: 1, title: 'SITE WORKS', notes: '', markup: 33.33, gst: 10, open: true, items: [] },
    { id: 2, title: 'CONCRETE WORKS (MANUAL POURING)', notes: '', markup: 33.33, gst: 10, open: true, items: [] },
    { id: 3, title: 'MASONRY WORKS', notes: '', markup: 33.33, gst: 10, open: true, items: [] },
    { id: 4, title: 'TILE WORKS', notes: '', markup: 33.33, gst: 10, open: true, items: [] },
    { id: 5, title: 'CEILING WORKS', notes: '', markup: 33.33, gst: 10, open: true, items: [] },
    { id: 6, title: 'PLUMBING WORKS', notes: '', markup: 33.33, gst: 10, open: true, items: [] },
    { id: 7, title: 'ELECTRICAL WORKS', notes: '', markup: 33.33, gst: 10, open: true, items: [] },
  ];


  async function handleLoadEstimate() {
    if (!confirm('Load saved estimate? This will replace the current estimate on screen.')) {
      return;
    }

    await loadEstimate();
  }

async function saveProjectDetails() {
  if (!project?.id) return;

  const { error } = await supabase
    .from('projects')
    .update({
      project_name: projectDetails.project_name,
      client_name: projectDetails.client_name,
      project_address: projectDetails.project_address,
      estimate_date: projectDetails.estimate_date || null,
    })
    .eq('id', project.id);

  if (error) {
    alert(error.message);
    return;
  }

  setSelectedProject({
    ...project,
    ...projectDetails,
  });
}



  async function saveEstimate(showAlert = true) {
    try {
      const projectId = project?.id;

      if (!projectId) {
        alert('Please select a project first.');
        return;
      }

      // 1. Find existing estimate
      const { data: existingEstimate, error: findError } = await supabase
        .from('estimates')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (findError) throw findError;

      let estimateId = existingEstimate?.id;

      // 2. Create estimate only if none exists
      if (!estimateId) {
        const { data: newEstimate, error: createError } = await supabase
          .from('estimates')
          .insert([{ project_id: projectId }])
          .select()
          .single();

        if (createError) throw createError;

        estimateId = newEstimate.id;
      }

      // 3. Delete old sections/items
      const { error: deleteError } = await supabase
        .from('estimate_sections')
        .delete()
        .eq('estimate_id', estimateId);

      if (deleteError) throw deleteError;

      // 4. Insert fresh sections
      const sectionRows = sections.map((section: any, index: number) => ({
        estimate_id: estimateId,
        title: section.title || 'Untitled Section',
        markup: parseFloat(section.markup) || 0,
        gst: parseFloat(section.gst) || 0,
        open: section.open ?? true,
        status: section.status || 'In-progress',
        sort_order: index,
      }));

      const { data: insertedSections, error: sectionError } = await supabase
        .from('estimate_sections')
        .insert(sectionRows)
        .select();

      if (sectionError) throw sectionError;

      // 5. Insert fresh items
      const itemRows: any[] = [];

      insertedSections.forEach((dbSection: any, sectionIndex: number) => {
        const localSection = sections[sectionIndex];

        localSection.items.forEach((item: any, itemIndex: number) => {
          itemRows.push({
            section_id: dbSection.id,
            description: item.description || '',
            quantity: parseFloat(item.quantity) || 0,
            unit: item.unit || '',
            unit_price: parseFloat(String(item.unitPrice).replace(/,/g, '')) || 0,
            markup: parseFloat(item.markup ?? localSection.markup) || 0,
            gst: parseFloat(item.gst ?? localSection.gst) || 0,
            sort_order: itemIndex,
          });
        });
      });

      if (itemRows.length > 0) {
        const { error: itemError } = await supabase
          .from('estimate_items')
          .insert(itemRows);

        if (itemError) throw itemError;
      }

      if (showAlert) {
  if (showAlert) {
  alert('Estimate saved.');
}
}
    } catch (err: any) {
      alert(err.message || 'Error saving estimate.');
    }
  }

  async function loadEstimate() {
    const { data: estimates, error: estimateError } = await supabase
      .from('estimates')
      .select('*')
      .eq('project_id', project?.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (estimateError) {
      alert(estimateError.message);
      return;
    }

    if (!estimates || estimates.length === 0) return;

    const estimateId = estimates[0].id;

    const { data: sectionsData, error: sectionError } = await supabase
      .from('estimate_sections')
      .select('*')
      .eq('estimate_id', estimateId)
      .order('sort_order', { ascending: true });

    if (sectionError) {
      alert(sectionError.message);
      return;
    }

    const { data: itemsData, error: itemError } = await supabase
      .from('estimate_items')
      .select('*');

    if (itemError) {
      alert(itemError.message);
      return;
    }

    const builtSections = (sectionsData || []).map((section: any) => ({
      id: section.id,
      title: section.title || 'Untitled Section',
      notes: '',
      markup: String(section.markup ?? ''),
      gst: String(section.gst ?? ''),
      open: section.open ?? true,
      status: section.status || 'In-progress',
      items: (itemsData || [])
        .filter((item: any) => item.section_id === section.id)
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((item: any) => ({
          id: item.id,
          description: item.description,
          quantity: String(item.quantity ?? ''),
          unit: item.unit,
          unitPrice: String(item.unit_price ?? ''),
          markup: String(item.markup ?? ''),
          gst: String(item.gst ?? ''),
        })),
    }));

    setSections(builtSections);
  }





  const uomOptions = ['ea', 'lm', 'm2', 'm3', 'hour'];

  const [scaleModeOpen, setScaleModeOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<any>(null);
  const [selectedCommonScale, setSelectedCommonScale] = useState('');
  const [manualScaleStep, setManualScaleStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [manualMeasurement, setManualMeasurement] = useState('');
  const [manualUnit, setManualUnit] = useState<'mm' | 'cm' | 'm'>('mm');

  const [measureMode, setMeasureMode] = useState(false);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null);

  const [manualHorizontalPixels, setManualHorizontalPixels] = useState(0);
const [manualVerticalPixels, setManualVerticalPixels] = useState(0);

const [manualHorizontalMm, setManualHorizontalMm] = useState(0);
const [manualVerticalMm, setManualVerticalMm] = useState(0);
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number } | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const [planZoom, setPlanZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const planScrollRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const zoomTimerRef = useRef<any>(null);

  const [uploadedPlans, setUploadedPlans] = useState<any[]>([]);

  const [sections, setSections] = useState<any[]>(defaultSections);


  const [projectDetails, setProjectDetails] = useState({
  project_name: project?.project_name || '',
  client_name: project?.client_name || '',
  project_address: project?.project_address || '',
  estimate_date: project?.estimate_date || '',
});

  const [editingItemId, setEditingItemId] = useState<number | 'all' | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<number | string | null>(null);

  const [draggedItem, setDraggedItem] = useState<{
    sectionId: number | string;
    itemId: number | string;
  } | null>(null);

  const [estimateTab, setEstimateTab] = useState<'details' | 'plans' | 'costings' | 'quotes' | 'specifications' | 'schedule'>('costings');



const [takeoffOpen, setTakeoffOpen] = useState(false);
const [activeTakeoffTarget, setActiveTakeoffTarget] = useState<{
  sectionId: number | string;
  itemId: number | string;
  description: string;
  unit: string;
} | null>(null);

const [takeoffTool, setTakeoffTool] = useState<
  'select' | 'point' | 'polygon' | 'rectangle' | 'ellipse' | 'line' | 'deduct'
>('point');

const takeoffColors = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#64748b',
  '#111827',
  '#ffffff',
];
const [takeoffColor, setTakeoffColor] = useState('#ef4444');
const deductColor = '#374151';
const [takeoffColorOpen, setTakeoffColorOpen] = useState(false);
const [takeoffShapes, setTakeoffShapes] = useState<any[]>([]);
const [currentPolygonPoints, setCurrentPolygonPoints] = useState<{ x: number; y: number }[]>([]);
const [currentLineStart, setCurrentLineStart] = useState<{ x: number; y: number } | null>(null);
const [currentRectangleStart, setCurrentRectangleStart] = useState<{ x: number; y: number } | null>(null);
const [currentEllipseStart, setCurrentEllipseStart] = useState<{ x: number; y: number } | null>(null);
const [currentDeductEllipseStart, setCurrentDeductEllipseStart] = useState<{ x: number; y: number } | null>(null);
const [deductMode, setDeductMode] = useState<'polygon' | 'rectangle' | 'ellipse'>('rectangle');
const [currentDeductPolygonPoints, setCurrentDeductPolygonPoints] = useState<{ x: number; y: number }[]>([]);
const [currentDeductRectangleStart, setCurrentDeductRectangleStart] = useState<{ x: number; y: number } | null>(null);
const [takeoffMousePoint, setTakeoffMousePoint] = useState<{ x: number; y: number } | null>(null);  
const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('');

  const [calculatorPosition, setCalculatorPosition] = useState({
    x: 420,
    y: 120,
  });

  const [isDraggingCalculator, setIsDraggingCalculator] = useState(false);
  const [calculatorDragOffset, setCalculatorDragOffset] = useState({
    x: 0,
    y: 0,
  });

useEffect(() => {
  function blockBrowserZoom(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }

function goToPreviousPlan() {
  if (uploadedPlans.length === 0) return;

  const currentIndex = uploadedPlans.findIndex(
    (plan) => plan.id === selectedPlan?.id
  );

  const previousIndex =
    currentIndex <= 0 ? uploadedPlans.length - 1 : currentIndex - 1;

  setSelectedPlanId(uploadedPlans[previousIndex].id);
}

function goToNextPlan() {
  if (uploadedPlans.length === 0) return;

  const currentIndex = uploadedPlans.findIndex(
    (plan) => plan.id === selectedPlan?.id
  );

  const nextIndex =
    currentIndex === -1 || currentIndex >= uploadedPlans.length - 1
      ? 0
      : currentIndex + 1;

  setSelectedPlanId(uploadedPlans[nextIndex].id);
}

  window.addEventListener('wheel', blockBrowserZoom, { passive: false });

  return () => {
    window.removeEventListener('wheel', blockBrowserZoom);
  };
}, []);


  useEffect(() => {
  if (project?.id) {
    setProjectDetails({
      project_name: project?.project_name || '',
      client_name: project?.client_name || '',
      project_address: project?.project_address || '',
      estimate_date: project?.estimate_date || '',
    });

    loadEstimate();
    loadProjectPlans();
  }
}, [project?.id]);

  useEffect(() => {
    localStorage.setItem('estimateSections', JSON.stringify(sections));
  }, [sections]);

  function lineTotal(item: any) {
    return toNumber(item.quantity) * toNumber(item.unitPrice);
  }

  function toNumber(value: any) {
    if (value === '' || value === null || value === undefined) return 0;

    const cleaned = String(value).replace(/,/g, '');
    const parsed = parseFloat(cleaned);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  function formatMoney(value: any) {
    return toNumber(value).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function cleanDecimalInput(value: string) {
    return value
      .replace(/,/g, '')
      .replace(/[^\d.]/g, '')
      .replace(/(\..*)\./g, '$1');
  }

  function lineQuoteTotal(item: any, section: any) {
    const cost = toNumber(item.quantity) * toNumber(item.unitPrice);

    const markup = 1 + (toNumber(item.markup ?? section.markup) / 100);
    const gst = 1 + (toNumber(item.gst ?? section.gst) / 100);

    return cost * markup * gst;
  }

  function sectionSubtotal(section: any) {
    return section.items.reduce((sum: number, item: any) => sum + lineTotal(item), 0);
  }

  function sectionQuoteTotal(section: any) {
    return section.items.reduce(
      (sum: number, item: any) => sum + lineQuoteTotal(item, section),
      0
    );
  }

  const grandTotal = sections.reduce(
    (sum, section) => sum + sectionQuoteTotal(section),
    0);

  function updateSection(sectionId: number, field: string, value: any) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  }

  function addSection() {
    const newSection = {
      id: Date.now(),
      title: 'NEW SECTION',
      notes: '',
      markup: '33.33',
      gst: '10',
      open: true,
      items: [],
    };

    setSections((current) => [...current, newSection]);
  }


  function addItem(sectionId: number) {
    const newItemId = Date.now();

    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            open: true,
            items: [
              ...section.items,
              {
                id: newItemId,
                description: '',
                quantity: 1,
                unit: '',
                unitPrice: 0,
                markup: section.markup,
                gst: section.gst,
              },
            ],
          }
          : section
      )
    );

    setEditingItemId(newItemId);
  }

  function updateItem(sectionId: number, itemId: number, field: string, value: any) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            items: section.items.map((item: any) =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          }
          : section
      )
    );
  }


  function moveItem(targetSectionId: number | string, targetItemId: number | string) {
    if (!draggedItem) return;

    setSections((current) => {
      const updated = current.map((section) => ({
        ...section,
        items: [...section.items],
      }));

      const fromSection = updated.find((section) => section.id === draggedItem.sectionId);
      const toSection = updated.find((section) => section.id === targetSectionId);

      if (!fromSection || !toSection) return current;

      const fromIndex = fromSection.items.findIndex((item: any) => item.id === draggedItem.itemId);
      const toIndex = toSection.items.findIndex((item: any) => item.id === targetItemId);

      if (fromIndex === -1 || toIndex === -1) return current;

      const [movedItem] = fromSection.items.splice(fromIndex, 1);
      toSection.items.splice(toIndex, 0, movedItem);

      return updated;
    });

    setDraggedItem(null);
  }




  function moveSection(targetSectionId: number | string) {
    if (!draggedSectionId || draggedSectionId === targetSectionId) return;

    setSections((current) => {
      const draggedIndex = current.findIndex((section) => section.id === draggedSectionId);
      const targetIndex = current.findIndex((section) => section.id === targetSectionId);

      if (draggedIndex === -1 || targetIndex === -1) return current;

      const updated = [...current];
      const [draggedSection] = updated.splice(draggedIndex, 1);

      updated.splice(targetIndex, 0, draggedSection);

      return updated;
    });

    setDraggedSectionId(null);
  }





  function duplicateSection(sectionId: number | string) {
    const sectionToCopy = sections.find(
      (section) => section.id === sectionId
    );

    if (!sectionToCopy) return;

    const copiedSection = {
      ...sectionToCopy,
      id: Date.now(),
      title: `${sectionToCopy.title} COPY`,
      open: true,
      status: 'In-progress',
      items: sectionToCopy.items.map((item: any, index: number) => ({
        ...item,
        id: Date.now() + index + 1,
      })),
    };

    setSections((current) => {
      const sectionIndex = current.findIndex(
        (section) => section.id === sectionId
      );

      if (sectionIndex === -1) return current;

      const updated = [...current];
      updated.splice(sectionIndex + 1, 0, copiedSection);

      return updated;
    });
  }




  function removeSection(sectionId: number) {
    const section = sections.find((s) => s.id === sectionId);

    if (!confirm(`Delete "${section?.title || 'this section'}"?`)) {
      return;
    }

    setSections((current) =>
      current.filter((section) => section.id !== sectionId)
    );
  }

  function duplicateItem(sectionId: number | string, itemId: number | string) {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) return section;

        const itemIndex = section.items.findIndex(
          (item: any) => item.id === itemId
        );

        if (itemIndex === -1) return section;

        const copiedItem = {
          ...section.items[itemIndex],
          id: Date.now(),
          description: `${section.items[itemIndex].description || 'Item'} COPY`,
        };

        const updatedItems = [...section.items];
        updatedItems.splice(itemIndex + 1, 0, copiedItem);

        return {
          ...section,
          items: updatedItems,
        };
      })
    );

    setEditingItemId('all');
  }

  function removeItem(sectionId: number, itemId: number) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            items: section.items.filter((item: any) => item.id !== itemId),
          }
          : section
      )
    );
  }


  function startCalculatorDrag(e: React.MouseEvent<HTMLDivElement>) {
    setIsDraggingCalculator(true);

    setCalculatorDragOffset({
      x: e.clientX - calculatorPosition.x,
      y: e.clientY - calculatorPosition.y,
    });
  }

  function moveCalculator(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDraggingCalculator) return;

    setCalculatorPosition({
      x: e.clientX - calculatorDragOffset.x,
      y: e.clientY - calculatorDragOffset.y,
    });
  }

  function stopCalculatorDrag() {
    setIsDraggingCalculator(false);
  }


  function openCalculator() {
    setCalculatorValue('');
    setCalculatorOpen(true);
  }

  function openTakeoff(sectionId?: number | string, item?: any) {
  if (!item) {
    alert('Select an estimate item first.');
    return;
  }

  const scaledPlans = uploadedPlans.filter((plan) => plan.scaled);

  if (scaledPlans.length === 0) {
    alert('Scale at least one plan first.');
    setEstimateTab('plans');
    return;
  }

  setActiveTakeoffTarget({
    sectionId: sectionId!,
    itemId: item.id,
    description: item.description || 'Takeoff item',
    unit: item.unit || 'ea',
  });

  setSelectedPlanId(scaledPlans[0].id);
setPlanZoom(1);
setTakeoffShapes([]);
  setCurrentPolygonPoints([]);
  setTakeoffOpen(true);

  if ((item.unit || '').toLowerCase() === 'm2') {
    setTakeoffTool('polygon');
  } else if ((item.unit || '').toLowerCase() === 'ea') {
    setTakeoffTool('point');
  } else {
    setTakeoffTool('line');
  }
}


async function loadProjectPlans() {
  if (!project?.id) return;

  const { data, error } = await supabase
    .from('project_plans')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: true });

  if (error) {
    alert(error.message);
    return;
  }


  const plans = (data || []).map((plan: any) => ({
    id: plan.id,
    name: plan.name,
    file: null,
    url: plan.file_url,
    fileType: plan.file_type,
    pageNumber: plan.page_number,
    scaled: plan.scaled,
    scale: plan.scale,
    scaleType: plan.scale_type,
    manualCalibration: plan.manual_calibration,
    rotation: plan.rotation || 0,
    saved: true,
  }));

  setUploadedPlans(plans);
  setSelectedPlanId(plans[0]?.id || null);
}



 async function handlePlanUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;

  if (!project?.id) {
    alert('Please select or create a project first.');
    return;
  }

  const newPlans: any[] = [];

  for (const file of files) {
    const filePath = `${project.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('plans')
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      alert(uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from('plans')
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    if (file.type === 'application/pdf') {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/legacy/build/pdf.worker.mjs',
        import.meta.url
      ).toString();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const { data: insertedPlan, error: insertError } = await supabase
          .from('project_plans')
          .insert([
            {
              project_id: project.id,
              name: `${file.name.replace(/\.[^/.]+$/, '')} - Page ${i}`,
              file_path: filePath,
              file_url: fileUrl,
              file_type: file.type,
              page_number: i,
              scaled: false,
              scale: '',
              scale_type: '',
              rotation: 0,
            },
          ])
          .select()
          .single();

        if (insertError) {
          alert(insertError.message);
          continue;
        }

        newPlans.push({
          id: insertedPlan.id,
          name: insertedPlan.name,
          file,
          url: fileUrl,
          fileType: file.type,
          pageNumber: i,
          scaled: false,
          scale: '',
          scaleType: '',
          rotation: 0,
          saved: true,
        });
      }
    } else {
      const { data: insertedPlan, error: insertError } = await supabase
        .from('project_plans')
        .insert([
          {
            project_id: project.id,
            name: file.name.replace(/\.[^/.]+$/, ''),
            file_path: filePath,
            file_url: fileUrl,
            file_type: file.type,
            page_number: 1,
            scaled: false,
            scale: '',
            scale_type: '',
            rotation: 0,
          },
        ])
        .select()
        .single();

      if (insertError) {
        alert(insertError.message);
        continue;
      }

      newPlans.push({
        id: insertedPlan.id,
        name: insertedPlan.name,
        file,
        url: fileUrl,
        fileType: file.type,
        pageNumber: 1,
        scaled: false,
        scale: '',
        scaleType: '',
        rotation: 0,
        saved: true,
      });
    }
  }

  setUploadedPlans((current) => [...current, ...newPlans]);
  setSelectedPlanId(newPlans[0]?.id || null);

  e.target.value = '';
}

const selectedPlan =
  uploadedPlans.find((plan) => plan.id === selectedPlanId) || uploadedPlans[0];

function isSelectedPlanPdf() {
  return (
    selectedPlan?.file?.type === 'application/pdf' ||
    selectedPlan?.fileType === 'application/pdf'
  );
}

function isSelectedPlanImage() {
  return (
    selectedPlan?.file?.type?.startsWith('image/') ||
    selectedPlan?.fileType?.startsWith('image/')
  );
}

  useEffect(() => {
    let cancelled = false;
    let currentRenderTask: any = null;

    async function renderSelectedPdfPage() {
      if ((!scaleModeOpen && !takeoffOpen) || !selectedPlan || !canvasRef.current) return;
      const isPdf =
  selectedPlan.file?.type === 'application/pdf' ||
  selectedPlan.fileType === 'application/pdf';

if (!isPdf) return;

      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/legacy/build/pdf.worker.mjs',
          import.meta.url
        ).toString();

        const arrayBuffer = selectedPlan.file
  ? await selectedPlan.file.arrayBuffer()
  : await fetch(selectedPlan.url).then((res) => res.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(selectedPlan.pageNumber || 1);

        if (cancelled || !canvasRef.current) return;

        const viewport = page.getViewport({
          scale: planZoom,
          rotation: selectedPlan.rotation || 0,
        });



        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        context.clearRect(0, 0, canvas.width, canvas.height);

        currentRenderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
        });

        renderTaskRef.current = currentRenderTask;

        await currentRenderTask.promise;

        if (renderTaskRef.current === currentRenderTask) {
          renderTaskRef.current = null;
        }
      } catch (error: any) {
        if (error?.name === 'RenderingCancelledException') {
          return;
        }

        console.error(error);
      }
    }

    renderSelectedPdfPage();

    return () => {
      cancelled = true;

      if (currentRenderTask) {
        currentRenderTask.cancel();
      }
    };
  }, [
    scaleModeOpen,
    takeoffOpen,
    selectedPlan?.id,
    selectedPlan?.pageNumber,
    selectedPlan?.rotation,
    selectedPlan?.url,
    planZoom
  ]);


useEffect(() => {
  if (!takeoffOpen) return;

  function handleTakeoffCtrlWheel(e: WheelEvent) {
    if (!e.ctrlKey) return;

    const container = planScrollRef.current;
    if (!container) return;

    e.preventDefault();
    e.stopPropagation();

    const oldZoom = planZoom;

    const newZoom =
      e.deltaY < 0
        ? Math.min(oldZoom + 0.1, 4)
        : Math.max(oldZoom - 0.1, 0.25);

    const centerX = container.scrollLeft + container.clientWidth / 2;
    const centerY = container.scrollTop + container.clientHeight / 2;
    const ratio = newZoom / oldZoom;

    smoothSetPlanZoom(newZoom);

    requestAnimationFrame(() => {
      const latestContainer = planScrollRef.current;
      if (!latestContainer) return;

      latestContainer.scrollLeft =
        centerX * ratio - latestContainer.clientWidth / 2;

      latestContainer.scrollTop =
        centerY * ratio - latestContainer.clientHeight / 2;
    });
  }

  window.addEventListener('wheel', handleTakeoffCtrlWheel, {
    passive: false,
  });

  return () => {
    window.removeEventListener('wheel', handleTakeoffCtrlWheel);
  };
}, [takeoffOpen, planZoom]);

  
  useEffect(() => {
    if (!scaleModeOpen) return;
    if (selectedPlan?.scaled) return;

    const container = planScrollRef.current!;
    
   function handleCtrlWheel(e: WheelEvent) {
  e.preventDefault();
  e.stopPropagation();

  const container = planScrollRef.current;
  if (!container) return;

  const oldZoom = planZoom;

  const newZoom =
    e.deltaY < 0
      ? Math.min(oldZoom + 0.1, 4)
      : Math.max(oldZoom - 0.1, 0.25);

  const centerX = container.scrollLeft + container.clientWidth / 2;
  const centerY = container.scrollTop + container.clientHeight / 2;

  const ratio = newZoom / oldZoom;

  smoothSetPlanZoom(newZoom);

  requestAnimationFrame(() => {
    container.scrollLeft = centerX * ratio - container.clientWidth / 2;
    container.scrollTop = centerY * ratio - container.clientHeight / 2;
  });
}
    container.addEventListener('wheel', handleCtrlWheel, { passive: false });

  return () => {
    container.removeEventListener('wheel', handleCtrlWheel);
  };
}, [scaleModeOpen, planZoom]);


   async function updateSelectedPlan(field: string, value: any) {
  if (!selectedPlan) return;

  setUploadedPlans((current) =>
    current.map((plan) =>
      plan.id === selectedPlan.id ? { ...plan, [field]: value } : plan
    )
  );

  const dbField =
    field === 'scaleType'
      ? 'scale_type'
      : field === 'manualCalibration'
        ? 'manual_calibration'
        : field;

  const { error } = await supabase
    .from('project_plans')
    .update({
      [dbField]: value,
    })
    .eq('id', selectedPlan.id);

  if (error) {
    alert(error.message);
  }
}

async function renameSelectedPlan(name: string) {
  await updateSelectedPlan('name', name);
}

async function rotateSelectedPlan(direction: 'left' | 'right') {
  const currentRotation = selectedPlan?.rotation || 0;
  const newRotation =
    direction === 'left' ? currentRotation - 90 : currentRotation + 90;

  await updateSelectedPlan('rotation', newRotation);
}

    
async function applyScaleToAllPlans() {
  if (!selectedPlan?.scaled) {
    alert('Scale the current plan first.');
    return;
  }

  setUploadedPlans((current) =>
    current.map((plan) => ({
      ...plan,
      scaled: true,
      scale: selectedPlan.scale,
      scaleType: selectedPlan.scaleType,
      manualCalibration: selectedPlan.manualCalibration || null,
    }))
  );

  const { error } = await supabase
    .from('project_plans')
    .update({
      scaled: true,
      scale: selectedPlan.scale,
      scale_type: selectedPlan.scaleType,
      manual_calibration: selectedPlan.manualCalibration || null,
    })
    .eq('project_id', project.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert('Scale applied to all plans.');
}
 

async function resetScale() {
  if (!selectedPlan) return;

  setUploadedPlans((current) =>
    current.map((plan) =>
      plan.id === selectedPlan.id
        ? {
            ...plan,
            scaled: false,
            scale: null,
            scaleType: null,
            manualCalibration: null,
          }
        : plan
    )
  );

  const { error } = await supabase
    .from('project_plans')
    .update({
      scaled: false,
      scale: null,
      scale_type: null,
      manual_calibration: null,
    })
    .eq('id', selectedPlan.id);

  if (error) {
    alert(error.message);
    return;
  }

  setMeasureMode(false);
  setMeasureStart(null);
  setMeasureEnd(null);
  setIsMeasuring(false);
}

    async function deleteSelectedPlan() {
  if (!selectedPlan) return;
  if (!confirm(`Delete "${selectedPlan.name}"?`)) return;

  const { error } = await supabase
    .from('project_plans')
    .delete()
    .eq('id', selectedPlan.id);

  if (error) {
    alert(error.message);
    return;
  }

  setUploadedPlans((current) =>
    current.filter((plan) => plan.id !== selectedPlan.id)
  );

  setSelectedPlanId(null);
}

    function lockZoomAfterScaling() {
      setPlanZoom(1);

      // 🔥 turn ON measurement automatically
      setMeasureMode(true);

      setIsMeasuring(false);
      setMeasureStart(null);
      setMeasureEnd(null);
    }

    async function applyCommonScale(applyToAll = false) {
  if (!selectedCommonScale) {
    alert('Please select a scale first.');
    return;
  }

  if (!selectedPlan) return;

  const scaleData = {
    scaled: true,
    scale: selectedCommonScale,
    scaleType: 'automatic',
    manualCalibration: null,
  };

  setUploadedPlans((current) =>
    current.map((plan) =>
      applyToAll || plan.id === selectedPlan.id
        ? {
            ...plan,
            ...scaleData,
          }
        : plan
    )
  );

  if (applyToAll) {
    const { error } = await supabase
      .from('project_plans')
      .update({
        scaled: true,
        scale: selectedCommonScale,
        scale_type: 'automatic',
        manual_calibration: null,
      })
      .eq('project_id', project.id);

    if (error) {
      alert(error.message);
      return;
    }
  } else {
    const { error } = await supabase
      .from('project_plans')
      .update({
        scaled: true,
        scale: selectedCommonScale,
        scale_type: 'automatic',
        manual_calibration: null,
      })
      .eq('id', selectedPlan.id);

    if (error) {
      alert(error.message);
      return;
    }
  }

  lockZoomAfterScaling();
}



    function getScaleNumber(scale: string) {
      return Number(scale.replace('1:', '')) || 0;
    }


function getPixelDistance(start: any, end: any) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy) / planZoom;
}


    function getMeasuredLengthMm() {
  if (!measureStart || !measureEnd || !selectedPlan) return 0;

  const dx = measureEnd.x - measureStart.x;
  const dy = measureEnd.y - measureStart.y;

  const pixelLength = Math.sqrt(dx * dx + dy * dy) / planZoom;

  if (selectedPlan.scaleType === 'manual' && selectedPlan.manualCalibration) {
    const { hPx, hMm, vPx, vMm } = selectedPlan.manualCalibration;

    const isMostlyHorizontal = Math.abs(dx) >= Math.abs(dy);

    if (isMostlyHorizontal && hPx > 0) {
      return pixelLength * (hMm / hPx);
    }

    if (!isMostlyHorizontal && vPx > 0) {
      return pixelLength * (vMm / vPx);
    }

    if (hPx > 0) {
      return pixelLength * (hMm / hPx);
    }
  }

  const scaleNumber = getScaleNumber(selectedPlan.scale);
  const screenMm = pixelLength * (25.4 / 96);

  return screenMm * scaleNumber;
}

    function getMeasuredLengthMeters() {
      return getMeasuredLengthMm() / 1000;
    }

function getMmPerBasePixelX() {
  if (!selectedPlan) return 0;

  if (selectedPlan.scaleType === 'manual' && selectedPlan.manualCalibration?.hPx) {
    return selectedPlan.manualCalibration.hMm / selectedPlan.manualCalibration.hPx;
  }

  const scaleNumber = getScaleNumber(selectedPlan.scale);
  return (25.4 / 96) * scaleNumber;
}

function getMmPerBasePixelY() {
  if (!selectedPlan) return 0;

  if (selectedPlan.scaleType === 'manual' && selectedPlan.manualCalibration?.vPx) {
    return selectedPlan.manualCalibration.vMm / selectedPlan.manualCalibration.vPx;
  }

  return getMmPerBasePixelX();
}

function getScaledLineMeters(start: { x: number; y: number }, end: { x: number; y: number }) {
  const baseDx = (end.x - start.x) / planZoom;
  const baseDy = (end.y - start.y) / planZoom;

  const mmX = baseDx * getMmPerBasePixelX();
  const mmY = baseDy * getMmPerBasePixelY();

  return Math.sqrt(mmX * mmX + mmY * mmY) / 1000;
}

function getScaledPolygonAreaM2(points: { x: number; y: number }[]) {
  if (points.length < 3) return 0;

  let pixelArea = 0;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];

    pixelArea += current.x * next.y - next.x * current.y;
  }

  const basePixelArea = Math.abs(pixelArea / 2) / (planZoom * planZoom);

  const areaMm2 =
    basePixelArea * getMmPerBasePixelX() * getMmPerBasePixelY();

  return areaMm2 / 1000000;
}

function getScaledRectangleAreaM2(start: { x: number; y: number }, end: { x: number; y: number }) {
  const widthBasePx = Math.abs(end.x - start.x) / planZoom;
  const heightBasePx = Math.abs(end.y - start.y) / planZoom;

  const widthM = (widthBasePx * getMmPerBasePixelX()) / 1000;
  const heightM = (heightBasePx * getMmPerBasePixelY()) / 1000;

  return widthM * heightM;
}

function getScaledEllipseAreaM2(start: { x: number; y: number }, end: { x: number; y: number }) {
  const widthBasePx = Math.abs(end.x - start.x) / planZoom;
  const heightBasePx = Math.abs(end.y - start.y) / planZoom;

  const radiusXM = (widthBasePx * getMmPerBasePixelX()) / 1000 / 2;
  const radiusYM = (heightBasePx * getMmPerBasePixelY()) / 1000 / 2;

  return Math.PI * radiusXM * radiusYM;
}

function smoothSetPlanZoom(nextZoom: number) {
  if (zoomTimerRef.current) {
    clearTimeout(zoomTimerRef.current);
  }

  zoomTimerRef.current = setTimeout(() => {
    setPlanZoom(nextZoom);
  }, 80);
}

function calculateTakeoffQuantity() {
  const unit = activeTakeoffTarget?.unit?.toLowerCase();

  if (unit === 'ea') {
    return takeoffShapes.filter((shape) => shape.type === 'point').length;
  }

  if (unit === 'm2') {
  return takeoffShapes.reduce((sum, shape) => {
    const areaTypes = ['polygon', 'rectangle', 'ellipse'];
    const deductTypes = ['deduct-polygon', 'deduct-rectangle', 'deduct-ellipse'];

    if (areaTypes.includes(shape.type)) {
      return sum + (shape.area || 0);
    }

    if (deductTypes.includes(shape.type)) {
      return sum - (shape.area || 0);
    }

    return sum;
  }, 0);
}

  return takeoffShapes.reduce((sum, shape) => {
    if (shape.type === 'line') {
      return sum + (shape.length || 0);
    }

    return sum;
  }, 0);
}

function undoLastTakeoffShape() {
  setTakeoffShapes((current) => current.slice(0, -1));
}

function clearAllTakeoffShapes() {
  if (!confirm('Remove all takeoff drawings?')) return;

  setTakeoffShapes([]);
  setCurrentPolygonPoints([]);
  setCurrentLineStart(null);
  setCurrentRectangleStart(null);
  setCurrentEllipseStart(null);
setCurrentDeductEllipseStart(null);
  setCurrentDeductPolygonPoints([]);
setCurrentDeductRectangleStart(null);
}


async function autoSaveProgress() {
  if (!project?.id) return;

  await saveProjectDetails();
  await saveEstimate(false);
}


function applyTakeoffQuantity() {
  if (!activeTakeoffTarget) return;

  const qty = Number(calculateTakeoffQuantity().toFixed(2));

  updateItem(
    activeTakeoffTarget.sectionId as number,
    activeTakeoffTarget.itemId as number,
    'quantity',
    qty
  );

  setTakeoffOpen(false);
  setEstimateTab('costings');
}

    function snapMeasurePoint(
  start: { x: number; y: number },
  current: { x: number; y: number }
) {
  const dx = Math.abs(current.x - start.x);
  const dy = Math.abs(current.y - start.y);

  if (dx > dy) {
    return {
      x: current.x,
      y: start.y,
    };
  }

  return {
    x: start.x,
    y: current.y,
  };
}



    
   function startManualScale() {
  setManualScaleStep(1);
  setManualMeasurement('');
  setManualUnit('mm');

  setManualHorizontalPixels(0);
  setManualVerticalPixels(0);
  setManualHorizontalMm(0);
  setManualVerticalMm(0);

  setMeasureMode(true);
  setIsMeasuring(false);
  setMeasureStart(null);
  setMeasureEnd(null);
}


function cancelManualScale() {
  setManualScaleStep(0);
  setManualMeasurement('');
  setIsMeasuring(false);
  setMeasureStart(null);
  setMeasureEnd(null);
}

async function nextManualScaleStep() {
  if (manualScaleStep === 1) {
    if (!manualHorizontalPixels) {
      alert('Draw the horizontal known line first.');
      return;
    }

    setManualScaleStep(2);
    return;
  }

  if (manualScaleStep === 2) {
    const value = parseFloat(manualMeasurement);

    if (!value) {
      alert('Enter the horizontal line length first.');
      return;
    }

    const mm =
      manualUnit === 'm' ? value * 1000 :
      manualUnit === 'cm' ? value * 10 :
      value;

    setManualHorizontalMm(mm);
setManualMeasurement('');

setMeasureStart(null);
setMeasureEnd(null);
setIsMeasuring(false);

setManualScaleStep(3);
return;
  }

  if (manualScaleStep === 3) {
    if (!manualVerticalPixels) {
      alert('Draw the vertical known line first.');
      return;
    }

    setManualScaleStep(4);
    return;
  }

  if (manualScaleStep === 4) {
    const value = parseFloat(manualMeasurement);

    if (!value) {
      alert('Enter the vertical line length first.');
      return;
    }

    const mm =
      manualUnit === 'm' ? value * 1000 :
      manualUnit === 'cm' ? value * 10 :
      value;

    const manualCalibration = {
  hPx: manualHorizontalPixels,
  hMm: manualHorizontalMm,
  vPx: manualVerticalPixels,
  vMm: mm,
};

setUploadedPlans((current) =>
  current.map((plan) =>
    plan.id === selectedPlan?.id
      ? {
          ...plan,
          scaled: true,
          scale: 'Manual',
          scaleType: 'manual',
          manualCalibration,
        }
      : plan
  )
);

await supabase
  .from('project_plans')
  .update({
    scaled: true,
    scale: 'Manual',
    scale_type: 'manual',
    manual_calibration: manualCalibration,
  })
  .eq('id', selectedPlan?.id);

    setManualScaleStep(0);
setManualMeasurement('');

setMeasureStart(null);
setMeasureEnd(null);
setIsMeasuring(false);

lockZoomAfterScaling();
  }
}

function goToPreviousPlan() {
  if (uploadedPlans.length === 0) return;

  const currentIndex = uploadedPlans.findIndex(
    (plan) => plan.id === selectedPlan?.id
  );

  const previousIndex =
    currentIndex <= 0 ? uploadedPlans.length - 1 : currentIndex - 1;

  setSelectedPlanId(uploadedPlans[previousIndex].id);
}

function goToNextPlan() {
  if (uploadedPlans.length === 0) return;

  const currentIndex = uploadedPlans.findIndex(
    (plan) => plan.id === selectedPlan?.id
  );

  const nextIndex =
    currentIndex === -1 || currentIndex >= uploadedPlans.length - 1
      ? 0
      : currentIndex + 1;

  setSelectedPlanId(uploadedPlans[nextIndex].id);
}


    function clearEstimate() {
      if (!confirm('Clear this estimate?')) return;
      setSections(defaultSections);
      setEditingItemId(null);
      localStorage.removeItem('estimateSections');
    }




    return (
      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => {
                setActivePage('projects');
                setSelectedProject(null);
              }}
              className="mb-3 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Projects
            </button>

            <h2 className="text-3xl font-bold">
              {project?.project_name || 'Construction Estimate'}
            </h2>

            <div className="mt-5 flex flex-wrap gap-2 border-b">
              {[
                { id: 'details', label: 'Estimate Details' },
                { id: 'plans', label: 'Plans & Takeoffs' },
                { id: 'costings', label: 'Estimate Costings' },
                { id: 'quotes', label: 'Request for Quotes' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'schedule', label: 'Schedule' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={async () => {
  await autoSaveProgress();
  setEstimateTab(tab.id as any);
}}
                  className={`px-4 py-3 text-sm font-medium ${estimateTab === tab.id
                    ? 'border-b-2 border-emerald-700 text-emerald-700'
                    : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>




            {estimateTab === 'plans' && (
              <div className="mt-6">
                {uploadedPlans.length === 0 ? (
                  <Card className="min-h-[250px] p-10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <h3 className="text-xl font-bold">
                        You haven't added a plan yet
                      </h3>

                      <p className="mt-5 max-w-xl text-slate-600">
                        Upload a plan or use the sample plan. Takeoffs can only be created
                        when you have uploaded and scaled plans.
                      </p>

                      <div className="mt-8 flex items-center gap-5">
                        <label className="cursor-pointer rounded-xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-800">
                          Upload a plan
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            multiple
                            className="hidden"
                            onChange={handlePlanUpload}
                          />
                        </label>

                        <button
                          type="button"
                          className="text-sm font-medium text-slate-700 hover:text-slate-900"
                          onClick={() => {
                            setUploadedPlans([
                              {
                                id: Date.now(),
                                name: 'Sample Ground Floor Plan',
                                file: null,
                                url: '',
                                scaled: false,
                              },
                            ]);
                          }}
                        >
                          Use sample plan
                        </button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2 border-b bg-white p-4">
                      <label className="cursor-pointer rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">
                        Add a plan
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          multiple
                          className="hidden"
                          onChange={handlePlanUpload}
                        />
                      </label>

                      <Button variant="outline">Share</Button>
                      <Button variant="outline">Delete all plans</Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-4">
                     <select
  value={selectedPlan?.id || ''}
  onChange={(e) => setSelectedPlanId(e.target.value)}
  className="min-w-[280px] flex-1 rounded-xl border px-3 py-2 text-sm"
>
  {uploadedPlans.map((plan) => (
    <option key={plan.id} value={plan.id}>
      {plan.name}
    </option>
  ))}
</select>

                      <Button variant="outline" onClick={goToPreviousPlan}>‹</Button>
                      <Button variant="outline" onClick={goToNextPlan}>›</Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentPlan = selectedPlan;
                          const newName = prompt('Rename plan:', currentPlan?.name || '');

                          if (!newName) return;

                          setUploadedPlans((current) =>
                            current.map((plan, index) =>
                              index === 0 ? { ...plan, name: newName } : plan
                            )
                          );
                        }}
                      >
                        ✎
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedPlanId(selectedPlan?.id);
                          setScaleModeOpen(true);
                        }}
                      >
                        📏 Scale plans
                      </Button>

                      <Button
  variant="outline"
  onClick={async () => {
    if (!confirm('Delete all uploaded plans?')) return;

    const { error } = await supabase
      .from('project_plans')
      .delete()
      .eq('project_id', project.id);

    if (error) {
      alert(error.message);
      return;
    }

    setUploadedPlans([]);
    setSelectedPlanId(null);
  }}
>
  <Trash2 size={16} />
</Button>
                    </div>

                    <div className="min-h-[520px] bg-slate-100 p-6">
                      <div className="mx-auto flex h-[460px] max-w-5xl items-center justify-center bg-white shadow-sm">
                        {selectedPlan?.url ? (
                          isSelectedPlanImage() ? (
                            <img
                              src={selectedPlan.url}
                              alt={selectedPlan.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <iframe
                              src={selectedPlan.url}
                              className="h-full w-full"
                              title={selectedPlan.name}
                            />
                          )
                        ) : (
                          <p className="text-slate-400">Sample plan preview area</p>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}





          </div>

          {estimateTab === 'costings' && (
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  await saveProjectDetails();
await saveEstimate();
setEditingItemId(null);
                }}
              >
                💾 Save
              </Button>

              <Button variant="outline" onClick={handleLoadEstimate}>
                Load Estimate
              </Button>

              <Button variant="outline" onClick={addSection}>
                <Plus size={16} className="mr-2" /> Add Section
              </Button>

              <Button variant="outline" onClick={clearEstimate}>
                Clear Estimate
              </Button>
            </div>
          )}
        </div>


        {estimateTab === 'costings' && (
          <>

            <Card className="mt-6 p-5">
  <div className="grid gap-4 md:grid-cols-4">
    <label>
      <span className="text-sm font-medium">Project</span>
      <input
        value={projectDetails.project_name}
        onChange={(e) =>
          setProjectDetails((current) => ({
            ...current,
            project_name: e.target.value,
          }))
        }
        className="mt-2 w-full rounded-xl border px-3 py-2"
        placeholder="Project name"
      />
    </label>

    <label>
      <span className="text-sm font-medium">Owner</span>
      <input
        value={projectDetails.client_name}
        onChange={(e) =>
          setProjectDetails((current) => ({
            ...current,
            client_name: e.target.value,
          }))
        }
        className="mt-2 w-full rounded-xl border px-3 py-2"
        placeholder="Owner / Client"
      />
    </label>

    <label>
      <span className="text-sm font-medium">Address</span>
      <input
        value={projectDetails.project_address}
        onChange={(e) =>
          setProjectDetails((current) => ({
            ...current,
            project_address: e.target.value,
          }))
        }
        className="mt-2 w-full rounded-xl border px-3 py-2"
        placeholder="Project address"
      />
    </label>

    <label>
      <span className="text-sm font-medium">Date Estimate</span>
      <input
        type="date"
        value={projectDetails.estimate_date || ''}
        onChange={(e) =>
          setProjectDetails((current) => ({
            ...current,
            estimate_date: e.target.value,
          }))
        }
        className="mt-2 w-full rounded-xl border px-3 py-2"
      />
    </label>
  </div>
</Card>

            <div className="mt-6 space-y-6">
              {sections.map((section, sectionIndex) => {
                const subtotal = section.items.reduce((sum: number, item: any) => {
                  return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
                }, 0);

                const quoteTotal = section.items.reduce((sum: number, item: any) => {
                  const qty = parseFloat(item.quantity) || 0;
                  const price = parseFloat(item.unitPrice) || 0;

                  const markup = 1 + (parseFloat(item.markup ?? section.markup) || 0) / 100;
                  const gst = 1 + (parseFloat(item.gst ?? section.gst) || 0) / 100;

                  return sum + (qty * price * markup * gst);
                }, 0);

                return (
                  <Card key={section.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => moveSection(section.id)}
                    className="overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b bg-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateSection(section.id, 'open', !section.open)}
                          className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100"
                        >
                          {section.open ? '▾' : '▸'}
                        </button>

                        <span draggable
                          onDragStart={() => setDraggedSectionId(section.id)}
                          onDragEnd={() => setDraggedSectionId(null)}
                          className="cursor-grab text-slate-400 active:cursor-grabbing"
                          title="Drag to reorder section"
                        >
                          ⠿
                        </span>
                        <span className="text-sm font-medium text-slate-500">{sectionIndex + 1}</span>

                        <button
                          onClick={() =>
                            updateSection(
                              section.id,
                              'status',
                              section.status === 'Done' ? 'In-progress' : 'Done'
                            )
                          }
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${section.status === 'Done'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                            }`}
                        >
                          {section.status || 'In-progress'}
                        </button>

                        <input
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          className="w-full rounded border-transparent bg-transparent text-lg font-bold text-slate-800 outline-none focus:border-slate-300 focus:bg-white focus:px-2"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={section.markup}
                          onChange={(e) => updateSection(section.id, 'markup', Number(e.target.value))}
                          className="w-20 rounded bg-blue-600 px-2 py-1 text-right text-xs font-bold text-white"
                        />

                        <span className="font-semibold">{currency.format(quoteTotal)}</span>
                      </div>


                      <button
                        onClick={() => duplicateSection(section.id)}
                        className="rounded border px-2 py-1 text-xs hover:bg-slate-100"
                        title="Duplicate section"
                      >
                        Copy
                      </button>



                      <button
                        onClick={() => removeSection(section.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete section"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                    {section.open && (
                      <>
                        <div className="grid gap-6 p-5 md:grid-cols-[1fr_340px]">
                          <div>
                            <textarea
                              value={section.notes || ''}
                              onChange={(e) => updateSection(section.id, 'notes', e.target.value)}
                              className="mb-4 h-20 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none"
                              placeholder="Add internal notes"
                            />

                            <div className="mb-4 flex gap-2">
                              <Button onClick={() => addItem(section.id)}>
                                <Plus size={16} className="mr-2" /> Add Item
                              </Button>

                              {editingItemId !== null ? (
                                <Button onClick={async () => {
                                  await saveEstimate();
                                  setEditingItemId(null);
                                }}
                                >
                                  💾 Save
                                </Button>
                              ) : (
                                <Button variant="outline" onClick={() => setEditingItemId('all')}>
                                  ✎ Edit
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="rounded-xl border bg-white p-4">
                            <div className="flex justify-between border-b py-2 text-sm">
                              <span>Total (Ex)</span>
                              <span>{currency.format(subtotal)}</span>
                            </div>

                            <div className="flex items-center justify-between border-b py-2 text-sm">
                              <span>Main Markup %</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={section.markup}
                                onChange={(e) => updateSection(section.id, 'markup', e.target.value)}
                                className="w-24 rounded bg-slate-50 px-2 py-1 text-right"
                              />
                            </div>

                            <div className="flex items-center justify-between border-b py-2 text-sm">
                              <span>Line GST %</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={section.gst}
                                onChange={(e) => updateSection(section.id, 'gst', Number(e.target.value))}
                                className="w-24 rounded bg-slate-50 px-2 py-1 text-right"
                              />
                            </div>

                            <div className="flex justify-between py-2 text-sm font-bold">
                              <span>Main Quote Total</span>
                              <span className="text-blue-600">{currency.format(quoteTotal)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="overflow-x-auto px-5 pb-5">
                          <table className="w-full min-w-[1200px] text-left text-sm">
                            <thead className="border-b text-slate-500">
                              <tr>
                                <th className="p-3">Description</th>
                                <th className="p-3">Qty</th>
                                <th className="p-3">Tools</th>
                                <th className="p-3">UOM</th>
                                <th className="p-3">Unit Cost (Ex)</th>
                                <th className="p-3">Total (Ex)</th>
                                <th className="p-3">Line Markup</th>
                                <th className="p-3">GST</th>
                                <th className="p-3">Quote Total</th>
                                <th className="p-3"></th>
                              </tr>
                            </thead>

                            <tbody>
                              {section.items.length === 0 && (
                                <tr>
                                  <td className="p-4 text-slate-500" colSpan={10}>
                                    No items yet. Click Add Item.
                                  </td>
                                </tr>
                              )}

                              {section.items.map((item: any, itemIndex: number) => {
                                const isEditing = editingItemId === 'all' || editingItemId === item.id;
                                const total = lineTotal(item);
                                const itemQuote = lineQuoteTotal(item, section);

                                return (
                                  <tr
                                    key={item.id}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => moveItem(section.id, item.id)}
                                    className="border-b hover:bg-slate-50"
                                    onDoubleClick={() => setEditingItemId(item.id)}
                                  >
                                    <td className="p-3">
                                      <div className="flex items-center gap-2">
                                        <span draggable
                                          onDragStart={() =>
                                            setDraggedItem({
                                              sectionId: section.id,
                                              itemId: item.id,
                                            })
                                          }
                                          onDragEnd={() => setDraggedItem(null)}
                                          className="cursor-grab text-slate-400 active:cursor-grabbing"
                                          title="Drag to reorder item"
                                        >
                                          <span
                                            draggable
                                            onDragStart={() =>
                                              setDraggedItem({
                                                sectionId: section.id,
                                                itemId: item.id,
                                              })
                                            }
                                            onDragEnd={() => setDraggedItem(null)}
                                            className="cursor-grab text-slate-400 active:cursor-grabbing"
                                            title="Drag to reorder item"
                                          >
                                            ⠿
                                          </span>

                                          <span className="w-10 text-slate-500">
                                            {sectionIndex + 1}.{itemIndex + 1}
                                          </span>
                                        </span>

                                        <input
                                          value={item.description}
                                          readOnly={!isEditing}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, 'description', e.target.value)
                                          }
                                          className="w-full rounded border px-2 py-1 read-only:border-transparent read-only:bg-transparent"
                                          placeholder="Description"
                                        />
                                      </div>
                                    </td>

                                    <td className="p-3">
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        value={item.quantity ?? ''}
                                        readOnly={!isEditing}
                                        onChange={(e) =>
                                          updateItem(section.id, item.id, 'quantity', cleanDecimalInput(e.target.value))
                                        }
                                        className="w-20 rounded border px-2 py-1 text-right read-only:border-transparent read-only:bg-transparent"
                                      />
                                    </td>

                                    <td className="p-3">
                                      <div className="flex gap-1">
                                        <button
                                          onClick={openCalculator}
                                          className="rounded border px-2 py-1 text-xs hover:bg-slate-100"
                                          title="Calculator"
                                        >
                                          🧮
                                        </button>

                                        <button
  onClick={async () => {
  await autoSaveProgress();
  openTakeoff(section.id, item);
}}
  className="rounded border px-2 py-1 text-xs hover:bg-slate-100"
  title="Takeoff"
>
  📐
</button>
                                      </div>
                                    </td>

                                    <td className="p-3">
                                      <input
                                        list="uom-options"
                                        value={item.unit === 'ea' ? 'each' : item.unit}
                                        readOnly={!isEditing}
                                        onChange={(e) =>
                                          updateItem(section.id, item.id, 'unit', e.target.value)
                                        }
                                        className="w-24 rounded border px-2 py-1 read-only:border-transparent read-only:bg-transparent"
                                        placeholder="UOM"
                                      />
                                    </td>

                                    <td className="p-3">
                                      <div className="flex items-center">
                                        <span className="mr-1 text-slate-500">₱</span>

                                        <input
                                          type="text"
                                          inputMode="decimal"
                                          value={item.unitPrice ?? ''}
                                          readOnly={!isEditing}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, 'unitPrice', cleanDecimalInput(e.target.value))
                                          }
                                          onBlur={() =>
                                            updateItem(section.id, item.id, 'unitPrice', formatMoney(item.unitPrice))
                                          }
                                          className="w-28 rounded border px-2 py-1 text-right read-only:border-transparent read-only:bg-transparent"
                                        />

                                      </div>
                                    </td>

                                    <td className="p-3">{currency.format(total)}</td>

                                    <td className="p-3">
                                      <div className="flex items-center">
                                        <input
                                          type="text"
                                          inputMode="decimal"
                                          value={item.markup ?? section.markup}
                                          readOnly={!isEditing}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, 'markup', e.target.value)
                                          }
                                          className="w-20 rounded border px-2 py-1 text-right read-only:border-transparent read-only:bg-transparent"
                                        />
                                        <span className="ml-1 text-slate-500">%</span>
                                      </div>
                                    </td>

                                    <td className="p-3">
                                      <div className="flex items-center">
                                        <input
                                          type="text"
                                          inputMode="decimal"
                                          value={item.gst ?? section.gst}
                                          readOnly={!isEditing}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, 'gst', e.target.value)
                                          }
                                          className="w-20 rounded border px-2 py-1 text-right text-blue-600 read-only:border-transparent read-only:bg-transparent"
                                        />
                                        <span className="ml-1 text-blue-600">%</span>
                                      </div>
                                    </td>

                                    <td className="p-3 font-semibold text-blue-600">
                                      {currency.format(itemQuote)}
                                    </td>

                                    <td className="p-3">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => duplicateItem(section.id, item.id)}
                                          className="rounded border px-2 py-1 text-xs hover:bg-slate-100"
                                          title="Copy item"
                                        >
                                          Copy
                                        </button>

                                        <button
                                          onClick={() => removeItem(section.id, item.id)}
                                          className="text-red-500 hover:text-red-700"
                                          title="Delete item"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          <datalist id="uom-options">
                            {uomOptions.map((uom) => (
                              <option key={uom} value={uom} />
                            ))}
                          </datalist>
                        </div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <Card className="w-full max-w-md p-6">
                <p className="text-sm text-slate-500">Grand Total</p>
                <p className="mt-2 text-4xl font-bold">{currency.format(grandTotal)}</p>
              </Card>
            </div>
          </>
        )}




        {calculatorOpen && (
          <div
            className="fixed inset-0 z-50 pointer-events-none"
            onMouseMove={moveCalculator}
            onMouseUp={stopCalculatorDrag}
            onMouseLeave={stopCalculatorDrag}
          >
            <div
              className="pointer-events-auto fixed w-full max-w-xs rounded-3xl bg-white p-5 shadow-xl"
              style={{
                left: calculatorPosition.x,
                top: calculatorPosition.y,
              }}
            >
              <div
                onMouseDown={startCalculatorDrag}
                className="mb-4 flex cursor-grab items-center justify-between active:cursor-grabbing"
              >
                <h3 className="text-lg font-bold">Calculator</h3>

                <button
                  onClick={() => setCalculatorOpen(false)}
                  className="rounded-full px-2 py-1 text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <input
                value={calculatorValue}
                readOnly
                className="mb-4 w-full rounded-xl border bg-slate-50 px-4 py-3 text-right text-2xl font-bold"
              />

              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/'].map((key) => (
                  <button
                    key={key}
                    onClick={() => setCalculatorValue((v) => v + key)}
                    className="rounded-xl border py-3 font-semibold hover:bg-slate-50"
                  >
                    {key}
                  </button>
                ))}

                {['4', '5', '6', '*'].map((key) => (
                  <button
                    key={key}
                    onClick={() => setCalculatorValue((v) => v + key)}
                    className="rounded-xl border py-3 font-semibold hover:bg-slate-50"
                  >
                    {key}
                  </button>
                ))}

                {['1', '2', '3', '-'].map((key) => (
                  <button
                    key={key}
                    onClick={() => setCalculatorValue((v) => v + key)}
                    className="rounded-xl border py-3 font-semibold hover:bg-slate-50"
                  >
                    {key}
                  </button>
                ))}

                {['0', '.', 'C', '+'].map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === 'C') {
                        setCalculatorValue('');
                        return;
                      }

                      setCalculatorValue((v) => v + key);
                    }}
                    className="rounded-xl border py-3 font-semibold hover:bg-slate-50"
                  >
                    {key}
                  </button>
                ))}

                <button
                  onClick={() => {
                    try {
                      const result = Function(`"use strict"; return (${calculatorValue})`)();
                      setCalculatorValue(String(result));
                    } catch {
                      setCalculatorValue('Error');
                    }
                  }}
                  className="col-span-4 rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  =
                </button>
              </div>
            </div>
          </div>
        )}



{takeoffOpen && selectedPlan && activeTakeoffTarget && (
  <div className="fixed inset-0 z-50 bg-slate-100">
    <div className="flex items-center justify-between border-b bg-white px-4 py-2">
      <div className="font-semibold">
        {selectedPlan.name}
      </div>

      <div className="text-sm">
        Apply to:{' '}
        <span className="font-bold text-blue-700">
          {activeTakeoffTarget.description}
        </span>
      </div>

      <div className="flex items-center gap-2">
  <button
    onClick={undoLastTakeoffShape}
    disabled={takeoffShapes.length === 0}
    title="Undo last drawing"
    className="flex h-10 w-10 items-center justify-center rounded border bg-white text-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40"
  >
    ↶
  </button>

  <button
    onClick={clearAllTakeoffShapes}
    disabled={takeoffShapes.length === 0}
    title="Remove all drawings"
    className="flex h-10 w-10 items-center justify-center rounded border bg-white text-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40"
  >
    🗑
  </button>

  <div className="h-8 border-l" />

  <button
    onClick={applyTakeoffQuantity}
    className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white"
  >
    Apply Selected
  </button>

        <button
          onClick={() => setTakeoffOpen(false)}
          className="rounded border px-3 py-2"
        >
          ✕
        </button>
      </div>
    </div>

    <div className="flex h-[calc(100vh-50px)]">
      <aside className="w-24 overflow-y-auto border-r bg-white p-2">
        {uploadedPlans
          .filter((plan) => plan.scaled)
          .map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`mb-2 w-full rounded border p-1 text-xs ${
                selectedPlan.id === plan.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="mb-1 h-12 rounded bg-slate-200" />
              <p className="truncate">{plan.name}</p>
              <p className="font-bold text-blue-700">{plan.scale}</p>
            </button>
          ))}
      </aside>

      <main className="flex-1 overflow-hidden">
        <div className="flex items-center justify-center gap-2 border-b bg-white px-3 py-2">
           <button
    onClick={() => setTakeoffTool('select')}
    className={`flex h-12 w-12 items-center justify-center rounded border ${
      takeoffTool === 'select' ? 'bg-blue-100' : ''
    }`}
  >
    <span className="flex h-full w-full items-center justify-center">
      <span className="text-2xl leading-none scale-110">↖</span>
    </span>
  </button>

  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
    Select / Edit
  </div>

          <div className="relative group">
  <button
    onClick={() => setTakeoffTool('point')}
    className={`flex h-12 w-12 items-center justify-center rounded border ${
      takeoffTool === 'point' ? 'bg-blue-100' : ''
    }`}
  >
    <span className="flex h-full w-full items-center justify-center">
      <span className="text-3xl leading-none">⦿</span>
    </span>
  </button>

  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
    Point Count
  </div>
</div>

          <div className="relative group">
  <button
    onClick={() => setTakeoffTool('polygon')}
    className={`flex h-12 w-12 items-center justify-center rounded border ${
      takeoffTool === 'polygon' ? 'bg-blue-100' : ''
    }`}
  >
    <span className="flex h-full w-full items-center justify-center">
      <span className="text-3xl leading-none">⬡</span>
    </span>
  </button>

  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
    Polygon Area
  </div>
</div>

          <div className="relative group">
  <button
    onClick={() => setTakeoffTool('rectangle')}
    className={`flex h-12 w-12 items-center justify-center rounded border ${
      takeoffTool === 'rectangle' ? 'bg-blue-100' : ''
    }`}
  >
    <span className="flex h-full w-full items-center justify-center">
      <span className="text-3xl leading-none">□</span>
    </span>
  </button>

  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
    Rectangle Area
  </div>
</div>

          <div className="relative group">
  <button
    onClick={() => setTakeoffTool('ellipse')}
    className={`flex h-12 w-12 items-center justify-center rounded border ${
      takeoffTool === 'ellipse' ? 'bg-blue-100' : ''
    }`}
  >
    <span className="flex h-full w-full items-center justify-center">
      <span className="text-3xl leading-none">○</span>
    </span>
  </button>

  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
    Ellipse Area
  </div>
</div>

          <div className="relative group">
  <button
    onClick={() => setTakeoffTool('line')}
    className={`flex h-12 w-12 items-center justify-center rounded border ${
      takeoffTool === 'line' ? 'bg-blue-100' : ''
    }`}
  >
    <span className="flex h-full w-full items-center justify-center">
      <span className="text-1xl leading-none">╱</span>
    </span>
  </button>

  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
    Line Length
  </div>
</div>

<div className="relative group flex items-center gap-2">
  <button
    onClick={() => setTakeoffTool('deduct')}
    className={`flex h-12 w-12 items-center justify-center rounded border ${
      takeoffTool === 'deduct' ? 'bg-blue-100' : ''
    }`}
  >
    <span className="flex h-full w-full items-center justify-center">
      <span className="text-2xl leading-none">▧</span>
    </span>
  </button>

  {takeoffTool === 'deduct' && (
    <select
      value={deductMode}
      onChange={(e) => setDeductMode(e.target.value as any)}
      className="h-10 rounded border bg-white px-3 text-sm"
    >
      <option value="rectangle">Deduct Rect</option>
      <option value="polygon">Deduct Poly</option>
      <option value="ellipse">Deduct Ellipse</option>
    </select>
  )}

  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
    Deduct / Reduction
  </div>
</div>



          <div className="relative ml-4">
  <button
    onClick={() => setTakeoffColorOpen((open) => !open)}
    className="flex h-10 w-10 items-center justify-center rounded-full border bg-white"
    title="Color palette"
  >
    <span
      className="h-7 w-7 rounded-full border"
      style={{ backgroundColor: takeoffColor }}
    />
  </button>

  {takeoffColorOpen && (
    <div className="absolute left-0 top-12 z-50 grid w-64 grid-cols-5 gap-3 rounded-2xl border bg-white p-4 shadow-xl">
      {takeoffColors.map((color) => (
        <button
          key={color}
          onClick={() => {
            setTakeoffColor(color);
            setTakeoffColorOpen(false);
          }}
          className={`h-10 w-10 rounded-full border transition hover:scale-110 ${
            takeoffColor === color ? 'ring-2 ring-slate-900' : ''
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )}
</div>

          <div className="absolute right-4 flex items-center gap-3">
  <button
    onClick={() => smoothSetPlanZoom(Math.max(planZoom - 0.25, 0.25))}
    className="rounded border bg-white px-3 py-1 text-sm font-bold hover:bg-slate-50"
  >
    −
  </button>

  <span className="text-sm font-semibold text-slate-600">
    {Math.round(planZoom * 100)}%
  </span>

  <button
    onClick={() => smoothSetPlanZoom(Math.min(planZoom + 0.25, 4))}
    className="rounded border bg-white px-3 py-1 text-sm font-bold hover:bg-slate-50"
  >
    +
  </button>

  <div className="ml-4 text-xl font-bold text-orange-600">
    {calculateTakeoffQuantity().toFixed(2)} {activeTakeoffTarget.unit}
  </div>
</div>
        </div>

       <div
  ref={planScrollRef}
  className="flex h-full items-start justify-center overflow-auto bg-slate-100 p-6"
>
  <div className="relative inline-block bg-white shadow">
            <canvas
  ref={canvasRef}
  className="cursor-crosshair"
  onMouseMove={(e) => {
    const isDrawing =
      currentLineStart ||
      currentRectangleStart ||
      currentEllipseStart ||
      currentPolygonPoints.length > 0 ||
      currentDeductRectangleStart ||
      currentDeductEllipseStart ||
      currentDeductPolygonPoints.length > 0;

    if (!isDrawing) {
      setTakeoffMousePoint(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    setTakeoffMousePoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }}
  onClick={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

   if (takeoffTool === 'select') {
  const clickedShape = takeoffShapes.find((shape) => {
    if (shape.type === 'point') {
      const dx = shape.x - point.x;
      const dy = shape.y - point.y;
      return Math.sqrt(dx * dx + dy * dy) < 14;
    }

    if (shape.type === 'line') {
      const distance =
        Math.abs(
          (shape.end.y - shape.start.y) * point.x -
            (shape.end.x - shape.start.x) * point.y +
            shape.end.x * shape.start.y -
            shape.end.y * shape.start.x
        ) /
        Math.sqrt(
          Math.pow(shape.end.y - shape.start.y, 2) +
            Math.pow(shape.end.x - shape.start.x, 2)
        );

      return distance < 10;
    }

    if (
      shape.type === 'rectangle' ||
      shape.type === 'ellipse' ||
      shape.type === 'deduct-rectangle' ||
      shape.type === 'deduct-ellipse'
    ) {
      const x1 = Math.min(shape.start.x, shape.end.x);
      const x2 = Math.max(shape.start.x, shape.end.x);
      const y1 = Math.min(shape.start.y, shape.end.y);
      const y2 = Math.max(shape.start.y, shape.end.y);

      return point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2;
    }

    if (shape.type === 'polygon' || shape.type === 'deduct-polygon') {
      let inside = false;

      for (
        let i = 0, j = shape.points.length - 1;
        i < shape.points.length;
        j = i++
      ) {
        const xi = shape.points[i].x;
        const yi = shape.points[i].y;
        const xj = shape.points[j].x;
        const yj = shape.points[j].y;

        const intersect =
          yi > point.y !== yj > point.y &&
          point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

        if (intersect) inside = !inside;
      }

      return inside;
    }

    return false;
  });

  if (clickedShape && confirm('Remove shape?')) {
    setTakeoffShapes((current) =>
      current.filter((shape) => shape.id !== clickedShape.id)
    );
  }

  return;
}

    if (takeoffTool === 'point') {
      setTakeoffShapes((current) => [
        ...current,
        {
          id: Date.now(),
          type: 'point',
          x: point.x,
          y: point.y,
          color: takeoffColor,
        },
      ]);

      return;
    }

    if (takeoffTool === 'line') {
      if (!currentLineStart) {
        setCurrentLineStart(point);
        return;
      }

      setTakeoffShapes((current) => [
        ...current,
        {
          id: Date.now(),
          type: 'line',
          start: currentLineStart,
          end: point,
          color: takeoffColor,
          length: getScaledLineMeters(currentLineStart, point),
        },
      ]);

      setCurrentLineStart(null);
      setTakeoffMousePoint(null);
      return;
    }

    if (takeoffTool === 'rectangle') {
      if (!currentRectangleStart) {
        setCurrentRectangleStart(point);
        return;
      }

      setTakeoffShapes((current) => [
        ...current,
        {
          id: Date.now(),
          type: 'rectangle',
          start: currentRectangleStart,
          end: point,
          color: takeoffColor,
          area: getScaledRectangleAreaM2(currentRectangleStart, point),
        },
      ]);

      setCurrentRectangleStart(null);
      setTakeoffMousePoint(null);
      return;
    }

    if (takeoffTool === 'ellipse') {
      if (!currentEllipseStart) {
        setCurrentEllipseStart(point);
        return;
      }

      setTakeoffShapes((current) => [
        ...current,
        {
          id: Date.now(),
          type: 'ellipse',
          start: currentEllipseStart,
          end: point,
          color: takeoffColor,
          area: getScaledEllipseAreaM2(currentEllipseStart, point),
        },
      ]);

      setCurrentEllipseStart(null);
      setTakeoffMousePoint(null);
      return;
    }

    if (takeoffTool === 'deduct') {
      if (deductMode === 'rectangle') {
        if (!currentDeductRectangleStart) {
          setCurrentDeductRectangleStart(point);
          return;
        }

        setTakeoffShapes((current) => [
          ...current,
          {
            id: Date.now(),
            type: 'deduct-rectangle',
start: currentDeductRectangleStart,
end: point,
color: deductColor,
area: getScaledRectangleAreaM2(currentDeductRectangleStart, point),
          },
        ]);

        setCurrentDeductRectangleStart(null);
        setTakeoffMousePoint(null);
        return;
      }

      if (deductMode === 'ellipse') {
        if (!currentDeductEllipseStart) {
          setCurrentDeductEllipseStart(point);
          return;
        }

        setTakeoffShapes((current) => [
          ...current,
          {
            id: Date.now(),
           type: 'deduct-ellipse',
start: currentDeductEllipseStart,
end: point,
color: deductColor,
area: getScaledEllipseAreaM2(currentDeductEllipseStart, point),
          },
        ]);

        setCurrentDeductEllipseStart(null);
        setTakeoffMousePoint(null);
        return;
      }

      if (deductMode === 'polygon') {
        const firstPoint = currentDeductPolygonPoints[0];

        if (
          firstPoint &&
          currentDeductPolygonPoints.length >= 3 &&
          Math.abs(point.x - firstPoint.x) < 12 &&
          Math.abs(point.y - firstPoint.y) < 12
        ) {
          setTakeoffShapes((current) => [
            ...current,
            {
              id: Date.now(),
             type: 'deduct-polygon',
points: currentDeductPolygonPoints,
color: deductColor,
area: getScaledPolygonAreaM2(currentDeductPolygonPoints),
            },
          ]);

          setCurrentDeductPolygonPoints([]);
          setTakeoffMousePoint(null);
          return;
        }

        setCurrentDeductPolygonPoints((current) => [...current, point]);
        return;
      }

      return;
    }

    if (takeoffTool === 'polygon') {
  const firstPoint = currentPolygonPoints[0];

  if (firstPoint) {
    const dx = point.x - firstPoint.x;
    const dy = point.y - firstPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (currentPolygonPoints.length >= 3 && distance < 14) {
        setTakeoffShapes((current) => [
          ...current,
          {
            id: Date.now(),
            type: 'polygon',
            points: currentPolygonPoints,
            color: takeoffColor,
            area: getScaledPolygonAreaM2(currentPolygonPoints),
          },
        ]);

              setCurrentPolygonPoints([]);
      setTakeoffMousePoint(null);
      return;
    }
  }

  setCurrentPolygonPoints((current) => [...current, point]);
  return;
}
  }}
/>

            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              {takeoffShapes.map((shape) => {
                if (shape.type === 'point') {
                  return (
                    <g key={shape.id}>
<circle cx={shape.x} cy={shape.y} r="10" fill={shape.color} />
                    </g>
                  );
                }

                if (shape.type === 'polygon') {
                  return (
                    <polygon
                      key={shape.id}
                      points={shape.points.map((p: any) => `${p.x},${p.y}`).join(' ')}
                      fill={shape.color}
                      stroke={shape.color}
                      opacity="0.35"
                      strokeWidth="2"
                    />
                  );
                }

                if (shape.type === 'line') {
  return (
    <line
      key={shape.id}
      x1={shape.start.x}
      y1={shape.start.y}
      x2={shape.end.x}
      y2={shape.end.y}
      stroke={shape.color}
      strokeWidth="3"
    />
  );
}

if (shape.type === 'deduct-polygon') {
  return (
    <polygon
      key={shape.id}
      points={shape.points.map((p: any) => `${p.x},${p.y}`).join(' ')}
      fill="#d1d5db"
      stroke={shape.color}
      opacity="0.85"
      strokeWidth="3"
      strokeDasharray="6 4"
    />
  );
}

if (shape.type === 'deduct-rectangle') {
  const x = Math.min(shape.start.x, shape.end.x);
  const y = Math.min(shape.start.y, shape.end.y);
  const width = Math.abs(shape.end.x - shape.start.x);
  const height = Math.abs(shape.end.y - shape.start.y);

  return (
    <rect
      key={shape.id}
      x={x}
      y={y}
      width={width}
      height={height}
      fill="#d1d5db"
      stroke={shape.color}
      opacity="0.85"
      strokeWidth="3"
      strokeDasharray="6 4"
    />
  );
}


if (shape.type === 'ellipse') {
  const cx = (shape.start.x + shape.end.x) / 2;
  const cy = (shape.start.y + shape.end.y) / 2;
  const rx = Math.abs(shape.end.x - shape.start.x) / 2;
  const ry = Math.abs(shape.end.y - shape.start.y) / 2;

  return (
    <ellipse
      key={shape.id}
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={shape.color}
      stroke={shape.color}
      opacity="0.35"
      strokeWidth="2"
    />
  );
}

if (shape.type === 'deduct-ellipse') {
  const cx = (shape.start.x + shape.end.x) / 2;
  const cy = (shape.start.y + shape.end.y) / 2;
  const rx = Math.abs(shape.end.x - shape.start.x) / 2;
  const ry = Math.abs(shape.end.y - shape.start.y) / 2;

  return (
    <ellipse
      key={shape.id}
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={shape.color}
      stroke={shape.color}
      opacity="0.85"
      strokeWidth="3"
      strokeDasharray="6 4"
    />
  );
}

if (shape.type === 'rectangle') {
  const x = Math.min(shape.start.x, shape.end.x);
  const y = Math.min(shape.start.y, shape.end.y);
  const width = Math.abs(shape.end.x - shape.start.x);
  const height = Math.abs(shape.end.y - shape.start.y);

  return (
    <rect
      key={shape.id}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={shape.color}
      stroke={shape.color}
      opacity="0.35"
      strokeWidth="2"
    />
  );
}

return null;
              })}

              {currentPolygonPoints.length > 0 && (
  <>
    <polyline
      points={currentPolygonPoints.map((p) => `${p.x},${p.y}`).join(' ')}
      fill="none"
      stroke={takeoffColor}
      strokeWidth="2"
    />

    {takeoffMousePoint && currentPolygonPoints.length > 0 && (() => {
  const first = currentPolygonPoints[0];
  const last = currentPolygonPoints[currentPolygonPoints.length - 1];

  const dx = takeoffMousePoint.x - first.x;
  const dy = takeoffMousePoint.y - first.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const isSnapping = distance < 14;

  const snapPoint = isSnapping ? first : takeoffMousePoint;

  return (
    <>
      {/* preview line */}
      <line
        x1={last.x}
        y1={last.y}
        x2={snapPoint.x}
        y2={snapPoint.y}
        stroke={takeoffColor}
        strokeWidth={2}
        strokeDasharray="4 4"
      />

      {/* highlight start point when snapping */}
      {isSnapping && (
        <circle
          cx={first.x}
          cy={first.y}
          r={8}
          fill={takeoffColor}
          opacity={0.4}
        />
      )}
    </>
  );
})()}
  </>
)}
           

{currentDeductPolygonPoints.length > 0 && (
  <>
    <polyline
      points={currentDeductPolygonPoints.map((p) => `${p.x},${p.y}`).join(' ')}
      fill="none"
      stroke={deductColor}
      strokeWidth="3"
      strokeDasharray="6 4"
    />

    {takeoffMousePoint && (() => {
      const first = currentDeductPolygonPoints[0];
      const last = currentDeductPolygonPoints[currentDeductPolygonPoints.length - 1];

      const dx = takeoffMousePoint.x - first.x;
      const dy = takeoffMousePoint.y - first.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const isSnapping = currentDeductPolygonPoints.length >= 3 && distance < 14;
      const snapPoint = isSnapping ? first : takeoffMousePoint;

      return (
        <>
          <line
            x1={last.x}
            y1={last.y}
            x2={snapPoint.x}
            y2={snapPoint.y}
           stroke={deductColor}
            strokeWidth={3}
            strokeDasharray="6 4"
          />

          {isSnapping && (
            <circle
              cx={first.x}
              cy={first.y}
              r={8}
              fill={deductColor}
              opacity={0.4}
            />
          )}
        </>
      );
    })()}
  </>
)}



{currentLineStart && takeoffMousePoint && (
  <>
    <line
      x1={currentLineStart.x}
      y1={currentLineStart.y}
      x2={takeoffMousePoint.x}
      y2={takeoffMousePoint.y}
      stroke={takeoffColor}
      strokeWidth={2}
      strokeDasharray="6,4"
    />
    <circle
      cx={currentLineStart.x}
      cy={currentLineStart.y}
      r={4}
      fill={takeoffColor}
    />
  </>
)}

{currentRectangleStart && takeoffMousePoint && (
  <>
    <rect
      x={Math.min(currentRectangleStart.x, takeoffMousePoint.x)}
      y={Math.min(currentRectangleStart.y, takeoffMousePoint.y)}
      width={Math.abs(takeoffMousePoint.x - currentRectangleStart.x)}
      height={Math.abs(takeoffMousePoint.y - currentRectangleStart.y)}
      fill={takeoffColor}
      stroke={takeoffColor}
      opacity={0.25}
      strokeWidth={2}
      strokeDasharray="4 4"
    />
  </>
)}

{currentDeductRectangleStart && takeoffMousePoint && (
  <rect
    x={Math.min(currentDeductRectangleStart.x, takeoffMousePoint.x)}
    y={Math.min(currentDeductRectangleStart.y, takeoffMousePoint.y)}
    width={Math.abs(takeoffMousePoint.x - currentDeductRectangleStart.x)}
    height={Math.abs(takeoffMousePoint.y - currentDeductRectangleStart.y)}
    fill="#d1d5db"
    stroke={takeoffColor}
    opacity={0.85}
    strokeWidth={3}
    strokeDasharray="6 4"
  />
)}


{currentEllipseStart && takeoffMousePoint && (
  <>
    <ellipse
      cx={(currentEllipseStart.x + takeoffMousePoint.x) / 2}
      cy={(currentEllipseStart.y + takeoffMousePoint.y) / 2}
      rx={Math.abs(takeoffMousePoint.x - currentEllipseStart.x) / 2}
      ry={Math.abs(takeoffMousePoint.y - currentEllipseStart.y) / 2}
      fill={takeoffColor}
      stroke={deductColor}
      opacity={0.25}
      strokeWidth={2}
      strokeDasharray="4 4"
    />
  </>
)}

{currentDeductEllipseStart && takeoffMousePoint && (
  <ellipse
    cx={(currentDeductEllipseStart.x + takeoffMousePoint.x) / 2}
    cy={(currentDeductEllipseStart.y + takeoffMousePoint.y) / 2}
    rx={Math.abs(takeoffMousePoint.x - currentDeductEllipseStart.x) / 2}
    ry={Math.abs(takeoffMousePoint.y - currentDeductEllipseStart.y) / 2}
    fill="#d1d5db"
    stroke={deductColor}
    opacity={0.85}
    strokeWidth={3}
    strokeDasharray="6 4"
  />
)}



</svg>
          </div>
        </div>
      </main>
    </div>
  </div>
)}



        {scaleModeOpen && selectedPlan && (
          <div
            className="fixed inset-0 z-50 bg-slate-100"

          >
            <div className="flex items-center justify-between bg-slate-700 px-4 py-2 text-white">
              <div className="text-sm font-semibold">Manage Plans</div>

              <button
                onClick={() => setScaleModeOpen(false)}
                className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Close
              </button>
            </div>

            <div className="flex items-end gap-4 border-b bg-slate-100 px-2 py-3">
              <div>
                <label className="block text-xs text-slate-500">Plan Name</label>
                <input
                  value={selectedPlan.name}
                  onChange={(e) => renameSelectedPlan(e.target.value)}
                  className="w-72 rounded border px-3 py-2 text-sm"
                />
              </div>

              <button
                onClick={() => rotateSelectedPlan('left')}
                className="rounded border bg-white px-3 py-2 hover:bg-slate-50"
              >
                ↶
              </button>

              <button
                onClick={() => rotateSelectedPlan('right')}
                className="rounded border bg-white px-3 py-2 hover:bg-slate-50"
              >
                ↷
              </button>

              <button
                onClick={deleteSelectedPlan}
                className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
              >
                <Trash2 size={16} />
              </button>

              <div className="ml-10">
                <label className="block text-xs text-slate-500">Select common scale</label>
                <select
                  value={selectedCommonScale}
                  onChange={(e) => setSelectedCommonScale(e.target.value)}
                  className="w-40 rounded border px-3 py-2 text-sm"
                >
                  <option value="">Select scale</option>
                  <option value="1:20">1:20</option>
                  <option value="1:50">1:50</option>
                  <option value="1:100">1:100</option>
                  <option value="1:150">1:150</option>
                  <option value="1:200">1:200</option>
                  <option value="1:250">1:250</option>
                  <option value="1:300">1:300</option>
                  <option value="1:400">1:400</option>
                  <option value="1:500">1:500</option>
                  <option value="1:1000">1:1000</option>
                </select>
              </div>

              <Button variant="outline" onClick={() => applyCommonScale(false)}>
                Apply to this plan
              </Button>

             <Button variant="outline" onClick={applyScaleToAllPlans}>
  Apply to all plans
</Button>

              <span className="pb-2 text-sm text-slate-500">or</span>

              <Button variant="outline" onClick={startManualScale}>
                Manually scale
              </Button>


<Button variant="outline" onClick={resetScale}>
  Reset Scale
</Button>

              {selectedPlan?.scale && (
                <div className="rounded bg-white px-3 py-2 text-sm text-slate-700">
                  Scale: <strong>{selectedPlan.scale}</strong>
                  {measureStart && measureEnd && (
                    <span className="ml-3">
                      Line: <strong>{getMeasuredLengthMm().toFixed(2)} mm</strong>
                    </span>
                  )}
                </div>
              )}



            </div>

            {manualScaleStep > 0 && (
              <div className="flex items-center gap-2 border-b bg-white px-6 py-2 text-sm">
                {manualScaleStep === 1 && (
                  <>
                    <span className="text-slate-500">
                      Step 1: Draw a HORIZONTAL line on the plan below
                    </span>
                    <Button variant="outline" onClick={cancelManualScale}>
                      Cancel
                    </Button>
                    <Button onClick={nextManualScaleStep}>Next</Button>
                  </>
                )}

                {manualScaleStep === 2 && (
                  <>
                    <span className="text-slate-500">
                      Step 2: How long is your line?
                    </span>
                    <input
                      value={manualMeasurement}
                      onChange={(e) => setManualMeasurement(e.target.value)}
                      className="w-40 rounded border px-3 py-2"
                      placeholder="0.00"
                    />
                    <select
                      value={manualUnit}
                      onChange={(e) => setManualUnit(e.target.value as any)}
                      className="rounded border px-3 py-2"
                    >
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                    </select>
                    <Button variant="outline" onClick={cancelManualScale}>
                      Cancel
                    </Button>
                    <Button onClick={nextManualScaleStep}>Next</Button>
                  </>
                )}

                {manualScaleStep === 3 && (
                   <>
    <span className="text-slate-500">
      Step 3: Draw a VERTICAL known line on the plan below
    </span>
    <Button variant="outline" onClick={cancelManualScale}>
      Cancel
    </Button>
    <Button onClick={nextManualScaleStep}>Next</Button>
  </>
                )}

{manualScaleStep === 4 && (
  <>
    <span className="text-slate-500">
      Step 4: How long is your vertical line?
    </span>
    <input
      value={manualMeasurement}
      onChange={(e) => setManualMeasurement(e.target.value)}
      className="w-40 rounded border px-3 py-2"
      placeholder="0.00"
    />
    <select
      value={manualUnit}
      onChange={(e) => setManualUnit(e.target.value as any)}
      className="rounded border px-3 py-2"
    >
      <option value="mm">mm</option>
      <option value="cm">cm</option>
      <option value="m">m</option>
    </select>
    <Button variant="outline" onClick={cancelManualScale}>
      Cancel
    </Button>
    <Button onClick={nextManualScaleStep}>Finish</Button>
  </>
)}
              </div>
            )}

            <div className="grid h-[calc(100vh-122px)] overflow-hidden grid-cols-[180px_1fr_70px]">
              <aside className="overflow-y-auto border-r bg-white">
                {uploadedPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setPlanZoom(1);
                      setMeasureMode(false);
                      setIsMeasuring(false);
                      setMeasureStart(null);
                      setMeasureEnd(null);
                    }}
                    className={`block w-full border-b p-2 text-left text-xs hover:bg-orange-50 ${selectedPlan.id === plan.id ? 'border-orange-400 bg-orange-50' : ''
                      }`}
                  >
                    <p className="truncate">{plan.name}</p>

                    <div className="mt-1 flex gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${plan.scaled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                          }`}
                      >
                        {plan.scaled ? 'Scaled' : 'Not Scaled'}
                      </span>

                      {plan.scale && (
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">
                          {plan.scale}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${plan.scaled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                          }`}
                      >
                        {plan.scaled ? 'Scaled' : 'Not Scaled'}
                      </span>

                      {plan.scale && (
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">
                          {plan.scale}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </aside>

              <main className="h-full overflow-hidden bg-white">
                <div ref={planScrollRef} className="h-full w-full overflow-auto p-8">
                  {isSelectedPlanImage() ? (
                    <img
                      src={selectedPlan.url}
                      alt={selectedPlan.name}
                      className="max-h-full max-w-full object-contain"
                      style={{
                        transform: `rotate(${selectedPlan.rotation || 0}deg)`,
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-start justify-center overflow-auto bg-white p-8">
                      {isSelectedPlanPdf() ? (
                        <div className="relative inline-block">
                          <canvas
                            ref={canvasRef}
                            className={`shadow-lg ${measureMode ? 'cursor-crosshair' : ''}`}
                            onClick={(e) => {
                              if (!measureMode) return;

                              const rect = e.currentTarget.getBoundingClientRect();
                              const point = {
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                              };

                              if (!isMeasuring) {
                                setMeasureStart(point);
                                setMeasureEnd(point);
                                setIsMeasuring(true);
                                return;
                              }

                              const snappedEnd = measureStart
  ? snapMeasurePoint(measureStart, point)
  : point;

setMeasureEnd(snappedEnd);

if (manualScaleStep === 1 && measureStart) {
  setManualHorizontalPixels(getPixelDistance(measureStart, snappedEnd));
  setManualScaleStep(2);
  setManualMeasurement('');
}

if (manualScaleStep === 3 && measureStart) {
  setManualVerticalPixels(getPixelDistance(measureStart, snappedEnd));
  setManualScaleStep(4);
  setManualMeasurement('');
}

setIsMeasuring(false);
                            }}
                            onMouseMove={(e) => {
                              if (!measureMode || !isMeasuring || !measureStart) return;

                              const rect = e.currentTarget.getBoundingClientRect();

                              const rawPoint = {
  x: e.clientX - rect.left,
  y: e.clientY - rect.top,
};

setMeasureEnd(snapMeasurePoint(measureStart, rawPoint));
                            }}
                            onMouseUp={(e) => {
                              if (!measureMode || !measureStart) return;

                              const rect = e.currentTarget.getBoundingClientRect();

                              setMeasureEnd({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                              });
                            }}
                          />

                         {measureStart && measureEnd && (
  <svg className="pointer-events-none absolute inset-0 h-full w-full">
    <line
      x1={measureStart.x}
      y1={measureStart.y}
      x2={measureEnd.x}
      y2={measureEnd.y}
      stroke="red"
      strokeWidth="2"
    />
  </svg>
)}
                          
                        </div>
                      ) : isSelectedPlanImage() ? (
                        <img
                          src={selectedPlan.url}
                          alt={selectedPlan.name}
                          className="shadow-lg"
                          style={{
                            width: `${planZoom * 100}%`,
                            maxWidth: 'none',
                            transform: `rotate(${selectedPlan.rotation || 0}deg)`,
                          }}
                        />
                      ) : (
                        <p className="text-slate-400">No preview available.</p>
                      )}
                    </div>
                  )}
                </div>
              </main>

              <aside className="flex flex-col items-center gap-2 border-l bg-white p-3">
                <button
                   onClick={() => smoothSetPlanZoom(Math.min(planZoom + 0.25, 4))}
  className="rounded border px-4 py-2 hover:bg-slate-50"
>
  +
                </button>

                <button
                   onClick={() => smoothSetPlanZoom(Math.max(planZoom - 0.25, 0.25))}
  className="rounded border px-4 py-2 hover:bg-slate-50"
>
  −
                </button>

                <div className="text-xs text-slate-500">
                  {Math.round(planZoom * 100)}%
                </div>
                <button className="rounded border px-4 py-2">⌘</button>
                <button className="rounded border px-4 py-2">↻</button>
                <button className="rounded border px-4 py-2">🏷</button>
              </aside>
            </div>
          </div>
        )}

      </section>
    );
  }



function NumberInput({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
  }) {
      return (
        <label className="block">
          <span className="text-sm font-medium">{label}</span>
          <input
            type="text"
            inputMode="decimal"
            step="0.01"
            value={value === 0 ? '' : value}
            placeholder="0"
            onFocus={(e) => {
              if (value === 0) onChange(0);
            }}
            onChange={(e) => onChange(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border px-3 py-2"
          />
        </label>
      );
    }



function ConcreteCalculator() {
      const mixRates: Record<string, { cement: number; sand: number; gravel: number; proportion: string }> = {
        AA: { cement: 12, sand: 0.5, gravel: 1, proportion: '1 : 1 1/2 : 3' },
        A: { cement: 9, sand: 0.5, gravel: 1, proportion: '1 : 2 : 4' },
        B: { cement: 7.5, sand: 0.5, gravel: 1, proportion: '1 : 2 1/2 : 5' },
        C: { cement: 6, sand: 0.5, gravel: 1, proportion: '1 : 3 : 6' },
      };

      const [mixClass, setMixClass] = useState('A');

      const [footing, setFooting] = useState({
        length: 0.0,
        width: 0.0,
        thickness: 0.0,
        count: 0,
      });

      const [wallFooting, setWallFooting] = useState({
        length: 0,
        width: 0.0,
        thickness: 0.0,
      });

      const [Slab, setSlab] = useState({
        length: 0,
        width: 0,
        thickness: 0.0,
      });

      const [rectColumn, setRectColumn] = useState({
        width1: 0.00,
        width2: 0.00,
        height: 0,
        count: 0,
      });

      const [circColumn, setCircColumn] = useState({
        diameter: 0,
        height: 0,
        count: 0,
      });

      const [beam, setBeam] = useState({
        length: 0,
        width: 0,
        depth: 0,
      });

      const [stair, setStair] = useState({
        riserHeight: 0.,
        treadRun: 0,
        stairWidth: 0,
        steps: 0,
        stringerThickness: 0.0,
      });

      const mix = mixRates[mixClass];

      function materials(volume: number) {
        return {
          volume,
          cement: Math.ceil(volume * mix.cement),
          sand: volume * mix.sand,
          gravel: volume * mix.gravel,
        };
      }

      const results = useMemo(() => {
        const footingVolume =
          footing.length * footing.width * footing.thickness * footing.count;

        const wallFootingVolume =
          wallFooting.length * wallFooting.width * wallFooting.thickness;

        const SlabVolume =
          Slab.length * Slab.width * Slab.thickness;

        const rectColumnVolume =
          rectColumn.width1 * rectColumn.width2 * rectColumn.height * rectColumn.count;

        const circleArea =
          (circColumn.diameter * circColumn.diameter) / 4 * Math.PI;

        const circularColumnVolume =
          circColumn.height * circColumn.count * circleArea;

        const beamVolume =
          beam.length * beam.width * beam.depth;

        const stairTriangleVolume =
          ((stair.treadRun * stair.riserHeight) / 2) *
          stair.stairWidth *
          stair.steps;

        const stairStringerVolume =
          Math.sqrt(
            stair.riserHeight * stair.riserHeight +
            stair.treadRun * stair.treadRun
          ) *
          stair.stairWidth *
          stair.steps *
          stair.stringerThickness;

        const stairVolume = stairTriangleVolume + stairStringerVolume;

        const rows = [
          { name: 'Footing', ...materials(footingVolume) },
          { name: 'Wall Footing', ...materials(wallFootingVolume) },
          { name: 'Slab', ...materials(SlabVolume) },
          { name: 'Rectangular Columns', ...materials(rectColumnVolume) },
          { name: 'Circular Columns', ...materials(circularColumnVolume) },
          { name: 'Concrete Beams', ...materials(beamVolume) },
          { name: 'Concrete Stairs', ...materials(stairVolume) },
        ];

        return rows;
      }, [mixClass, footing, wallFooting, Slab, rectColumn, circColumn, beam, stair]);

      const totals = results.reduce(
        (sum, row) => ({
          volume: sum.volume + row.volume,
          cement: sum.cement + row.cement,
          sand: sum.sand + row.sand,
          gravel: sum.gravel + row.gravel,
        }),
        { volume: 0, cement: 0, sand: 0, gravel: 0 }
      );


      const footingResult = results.find((r) => r.name === 'Footing');
      const wallFootingResult = results.find((r) => r.name === 'Wall Footing');
      const slabResult = results.find((r) => r.name === 'Slab');
      const rectColumnResult = results.find((r) => r.name === 'Rectangular Columns');
      const circColumnResult = results.find((r) => r.name === 'Circular Columns');
      const beamResult = results.find((r) => r.name === 'Concrete Beams');
      const stairResult = results.find((r) => r.name === 'Concrete Stairs');

      function addConcreteToEstimate() {
        const concreteItems = [
          {
            id: Date.now() + 1,
            description: 'Concrete Works - Cement',
            quantity: totals.cement,
            unit: 'bags',
            unitPrice: 0,
          },
          {
            id: Date.now() + 2,
            description: 'Concrete Works - Sand',
            quantity: Number(totals.sand.toFixed(2)),
            unit: 'm³',
            unitPrice: 0,
          },
          {
            id: Date.now() + 3,
            description: 'Concrete Works - Gravel',
            quantity: Number(totals.gravel.toFixed(2)),
            unit: 'm³',
            unitPrice: 0,
          },
        ];

        const existing = JSON.parse(localStorage.getItem('estimateItems') || '[]');
        localStorage.setItem('estimateItems', JSON.stringify([...existing, ...concreteItems]));

        alert('Concrete materials added to estimate.');
      }



      return (
        <section>
          <h2 className="text-3xl font-bold">Concrete Calculator</h2>
          <p className="mt-2 text-slate-500">
            Converted from your Excel Concrete sheet.
          </p>

          <Card className="mt-6 p-5">
            <p className="text-sm font-medium">Class of Concrete Mix</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {Object.keys(mixRates).map((key) => (
                <button
                  key={key}
                  onClick={() => setMixClass(key)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium ${mixClass === key
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {key} — {mixRates[key].proportion}
                </button>
              ))}
            </div>
          </Card>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-lg font-semibold">Footing</h3>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <NumberInput label="Length" value={footing.length} onChange={(v) => setFooting({ ...footing, length: v })} />
                <NumberInput label="Width" value={footing.width} onChange={(v) => setFooting({ ...footing, width: v })} />
                <NumberInput label="Thickness" value={footing.thickness} onChange={(v) => setFooting({ ...footing, thickness: v })} />
                <NumberInput label="No. of Footings" value={footing.count} onChange={(v) => setFooting({ ...footing, count: v })} />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold">Footing Result</p>
                <p>Volume: {(footingResult?.volume || 0).toFixed(3)} m³</p>
                <p>Cement: {footingResult?.cement || 0} bags</p>
                <p>Sand: {(footingResult?.sand || 0).toFixed(2)} m³</p>
                <p>Gravel: {(footingResult?.gravel || 0).toFixed(2)} m³</p>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-semibold">Wall Footing</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <NumberInput label="Length" value={wallFooting.length} onChange={(v) => setWallFooting({ ...wallFooting, length: v })} />
                <NumberInput label="Width" value={wallFooting.width} onChange={(v) => setWallFooting({ ...wallFooting, width: v })} />
                <NumberInput label="Thickness" value={wallFooting.thickness} onChange={(v) => setWallFooting({ ...wallFooting, thickness: v })} />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold">Wall Footing Result</p>
                <p>Volume: {(wallFootingResult?.volume || 0).toFixed(3)} m³</p>
                <p>Cement: {wallFootingResult?.cement || 0} bags</p>
                <p>Sand: {(wallFootingResult?.sand || 0).toFixed(2)} m³</p>
                <p>Gravel: {(wallFootingResult?.gravel || 0).toFixed(2)} m³</p>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-semibold">Slab</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <NumberInput label="Length" value={Slab.length} onChange={(v) => setSlab({ ...Slab, length: v })} />
                <NumberInput label="Width" value={Slab.width} onChange={(v) => setSlab({ ...Slab, width: v })} />
                <NumberInput label="Thickness" value={Slab.thickness} onChange={(v) => setSlab({ ...Slab, thickness: v })} />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold">Slab Result</p>
                <p>Volume: {(slabResult?.volume || 0).toFixed(3)} m³</p>
                <p>Cement: {slabResult?.cement || 0} bags</p>
                <p>Sand: {(slabResult?.sand || 0).toFixed(2)} m³</p>
                <p>Gravel: {(slabResult?.gravel || 0).toFixed(2)} m³</p>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-semibold">Rectangular Columns</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <NumberInput label="Width 1" value={rectColumn.width1} onChange={(v) => setRectColumn({ ...rectColumn, width1: v })} />
                <NumberInput label="Width 2" value={rectColumn.width2} onChange={(v) => setRectColumn({ ...rectColumn, width2: v })} />
                <NumberInput label="Height" value={rectColumn.height} onChange={(v) => setRectColumn({ ...rectColumn, height: v })} />
                <NumberInput label="No. of Columns" value={rectColumn.count} onChange={(v) => setRectColumn({ ...rectColumn, count: v })} />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold">Rectangular Columns Result</p>
                <p>Volume: {(rectColumnResult?.volume || 0).toFixed(3)} m³</p>
                <p>Cement: {rectColumnResult?.cement || 0} bags</p>
                <p>Sand: {(rectColumnResult?.sand || 0).toFixed(2)} m³</p>
                <p>Gravel: {(rectColumnResult?.gravel || 0).toFixed(2)} m³</p>
              </div>

            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-semibold">Circular Columns</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <NumberInput label="Diameter" value={circColumn.diameter} onChange={(v) => setCircColumn({ ...circColumn, diameter: v })} />
                <NumberInput label="Height" value={circColumn.height} onChange={(v) => setCircColumn({ ...circColumn, height: v })} />
                <NumberInput label="No. of Columns" value={circColumn.count} onChange={(v) => setCircColumn({ ...circColumn, count: v })} />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold">Circular Columns Result</p>
                <p>Volume: {(circColumnResult?.volume || 0).toFixed(3)} m³</p>
                <p>Cement: {circColumnResult?.cement || 0} bags</p>
                <p>Sand: {(circColumnResult?.sand || 0).toFixed(2)} m³</p>
                <p>Gravel: {(circColumnResult?.gravel || 0).toFixed(2)} m³</p>
              </div>

            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-semibold">Concrete Beams</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <NumberInput label="Length" value={beam.length} onChange={(v) => setBeam({ ...beam, length: v })} />
                <NumberInput label="Width" value={beam.width} onChange={(v) => setBeam({ ...beam, width: v })} />
                <NumberInput label="Depth" value={beam.depth} onChange={(v) => setBeam({ ...beam, depth: v })} />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold">Beam Result</p>
                <p>Volume: {(beamResult?.volume || 0).toFixed(3)} m³</p>
                <p>Cement: {beamResult?.cement || 0} bags</p>
                <p>Sand: {(beamResult?.sand || 0).toFixed(2)} m³</p>
                <p>Gravel: {(beamResult?.gravel || 0).toFixed(2)} m³</p>
              </div>

            </Card>

            <Card className="p-5 md:col-span-2">
              <h3 className="text-lg font-semibold">Concrete Stairs</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-5">
                <NumberInput label="Riser Height" value={stair.riserHeight} onChange={(v) => setStair({ ...stair, riserHeight: v })} />
                <NumberInput label="Tread Run" value={stair.treadRun} onChange={(v) => setStair({ ...stair, treadRun: v })} />
                <NumberInput label="Stair Width" value={stair.stairWidth} onChange={(v) => setStair({ ...stair, stairWidth: v })} />
                <NumberInput label="No. of Steps" value={stair.steps} onChange={(v) => setStair({ ...stair, steps: v })} />
                <NumberInput label="Stringer Thickness" value={stair.stringerThickness} onChange={(v) => setStair({ ...stair, stringerThickness: v })} />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold">Stairs Result</p>
                <p>Volume: {(stairResult?.volume || 0).toFixed(3)} m³</p>
                <p>Cement: {stairResult?.cement || 0} bags</p>
                <p>Sand: {(stairResult?.sand || 0).toFixed(2)} m³</p>
                <p>Gravel: {(stairResult?.gravel || 0).toFixed(2)} m³</p>
              </div>

            </Card>
          </div>

          <Card className="mt-6 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Part</th>
                  <th className="p-4">Concrete Volume</th>
                  <th className="p-4">Cement</th>
                  <th className="p-4">Sand</th>
                  <th className="p-4">Gravel</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.name} className="border-t">
                    <td className="p-4 font-medium">{row.name}</td>
                    <td className="p-4">{row.volume.toFixed(3)} m³</td>
                    <td className="p-4">{row.cement} bags</td>
                    <td className="p-4">{row.sand.toFixed(2)} m³</td>
                    <td className="p-4">{row.gravel.toFixed(2)} m³</td>
                  </tr>
                ))}
                <tr className="border-t bg-slate-50 font-bold">
                  <td className="p-4">TOTAL</td>
                  <td className="p-4">{totals.volume.toFixed(3)} m³</td>
                  <td className="p-4">{totals.cement} bags</td>
                  <td className="p-4">{totals.sand.toFixed(2)} m³</td>
                  <td className="p-4">{totals.gravel.toFixed(2)} m³</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button onClick={addConcreteToEstimate}>
              <Plus size={16} className="mr-2" /> Add Concrete Result to Estimate
            </Button>
          </div>
        </section>
      );
    }




export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
        setIsLoggedIn(!!data.session);
        setLoading(false);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsLoggedIn(!!session);
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    }, []);

    async function handleLogout() {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
    }

    if (loading) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100">
          <p className="text-slate-500">Loading...</p>
        </main>
      );
    }

    if (!isLoggedIn) {
      return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="flex">
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
          />

          <main className="w-full p-5 md:p-8">
            {activePage === 'dashboard' && <Dashboard />}
            {activePage === 'projects' && (
              <Projects onSelectProject={(project) => {
                setSelectedProject(project);
                setActivePage('estimate');
              }} />
            )}
            {activePage === 'materials' && <Materials />}
            {activePage === 'estimate' && <EstimateBuilder
              project={selectedProject}
              setActivePage={setActivePage}
              setSelectedProject={setSelectedProject}
            />}
            {activePage === 'concrete' && <ConcreteCalculator />}
          </main>
        </div>
      </div>
    );
  }