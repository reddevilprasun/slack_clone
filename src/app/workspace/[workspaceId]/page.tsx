export default function Workspace({params}: {params: {workspaceId: string}}) {
  return (
    <div>
      <h1>Workspace {params.workspaceId}</h1>
    </div>
  );
}