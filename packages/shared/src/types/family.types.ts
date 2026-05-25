export interface Family {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyMember {
  userId: string;
  familyId: string;
  role: 'admin' | 'parent' | 'child' | 'guest';
  name: string;
}
